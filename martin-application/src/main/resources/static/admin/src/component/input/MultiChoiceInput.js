/* 
 * The MIT License
 *
 * Copyright 2020 ss.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import React, { useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import DataService from '../../service/DataService';
import { useTranslation } from 'react-i18next';

export default function MultiChoiceInput(props) {
    const { entity, field, label, genericClass, isEnum, onChange, selected } = props;
    const { t } = useTranslation();
    // ------------------------------------------ STATE -----------------------------------------------------------------------------------
    const [data, setData] = React.useState(null);
    // ------------------------------------------ HOOKS -----------------------------------------------------------------------------------
    useEffect(() => {
        if (!data) {
            DataService.requestGet('/entity/collection/' + entity + '/' + field).then(resp => {
                setData(resp);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);
    // ------------------------------------------ RENDERING -------------------------------------------------------------------------------
    if (!data) {
        return null;
    }
    return (
            <React.Fragment>
                {label ? (<InputLabel shrink={true} variant={'standard'}>{label}</InputLabel>) : ''}
                <Table>
                    <TableBody>
                        {data.map((item, i) => {
                            return (
                                <TableRow padding="none" key={i}>
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={isEnum ? selected.has(item) : false} onClick={event => {onChange(field, isEnum ? item : null)}}/>
                                    </TableCell>
                                    <TableCell>
                                        {isEnum ? t('enum.' + genericClass + '.' + item) : item}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </React.Fragment>
    );
}
