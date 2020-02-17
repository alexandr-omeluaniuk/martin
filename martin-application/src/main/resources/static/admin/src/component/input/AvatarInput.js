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

import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useTranslation } from 'react-i18next';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

function AvatarInput(props) {
    const { value, label, onChange } = props;
    const { t } = useTranslation();
    let inputRef = React.createRef();
    const onFileSelected = (e) => {
        let files = inputRef.current.files;
        if (files[0]) {
            var reader = new FileReader();
            reader.addEventListener("load", function(e) {
                onChange(e.target.result);
            }); 
            reader.readAsDataURL(files[0]);
        }
    };
    let ava = value ? (<Avatar src={value} />) : (<Avatar><Icon>perm_identity</Icon></Avatar>);
    return (
            <Card>
                <CardHeader avatar={ava} subheader={label} action={
                <React.Fragment>
                    <Tooltip title={t('common.upload')}>
                        <IconButton onClick={() => {
                            inputRef.current.click();
                        }}>
                            <Icon>get_app</Icon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.clear')}>
                        <IconButton onClick={() => {
                            onChange(null);
                        }}>
                            <Icon>close</Icon>
                        </IconButton>
                    </Tooltip>
                </React.Fragment>
                }/>
                <input type="file" ref={inputRef} hidden accept="image/x-png,image/gif,image/jpeg" onChange={onFileSelected}/>
            </Card>
    );
}

export default AvatarInput;