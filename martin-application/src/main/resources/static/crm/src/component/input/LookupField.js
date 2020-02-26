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
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import DataService from '../../service/DataService';

function LookupField(props) {
    const { field, label, value, helperText, name, error, onChange } = props;
    console.log(field);
    const inputRef = React.useRef();
    // ----------------------------------------------------- STATE ------------------------------------------------------------------------
    const [readOnly, setReadOnly] = React.useState(true);
    const [displayedValue, setDisplayedValue] = React.useState('');
    // ----------------------------------------------------- FUNCTIONS --------------------------------------------------------------------
    const startSearch = () => {
        setReadOnly(false);
        inputRef.current.focus();
    };
    
    const doSearch = (e) => {
        setDisplayedValue(e.target.value);
        DataService.requestPost('/entity/search/' + field.attributes.relationshipType, {
            page: 1,
            pageSize: 5,
            //order: order,
            //orderBy: orderBy
        }).then(resp => {
            console.log(resp.data);
        });
    };
    
    const start = () => {
        return (
            <InputAdornment position="start">
                <Icon>{field.attributes.icon ? field.attributes.icon : 'extension'}</Icon>
            </InputAdornment>
        );
    };
    
    const end = () => {
        return (
            <InputAdornment position="end">
                <IconButton onClick={startSearch}>
                    <Icon>search</Icon>
                </IconButton>
            </InputAdornment>
        );
    };
    
    return (
        <TextField label={label} fullWidth={true} value={displayedValue} InputProps={{
            startAdornment: start(),
            endAdornment: end(),
            readOnly: readOnly
        }} helperText={helperText} error={error} name={name} inputRef={inputRef} onChange={doSearch}/>
    );
}

export default LookupField;
