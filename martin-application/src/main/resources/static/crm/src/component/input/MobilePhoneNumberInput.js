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
import MaskedInput from 'react-text-mask';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

function PhoneMask(props) {
    const { inputRef, ...other } = props;
    return (
            <MaskedInput {...other} ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }} mask={['+', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]} 
            placeholderChar={'\u2000'} showMask />
    );
}

function MobilePhoneNumberInput(props) {
    const { label, value, onChange, fullWidth, helperText, endAdornment, readOnly, inputRef, onBlur, onKeyUp } = props;
    return (
            <FormControl fullWidth={fullWidth} error={helperText ? true : false}>
                <InputLabel htmlFor="formatted-text-mask-input">{label}</InputLabel>
                <Input value={value} onChange={onChange} id="formatted-text-mask-input"
                    inputComponent={PhoneMask} endAdornment={endAdornment} readOnly={readOnly} inputRef={inputRef}
                    onBlur={onBlur} onKeyUp={onKeyUp}/>
                <FormHelperText error={helperText ? true : false}>{helperText ? helperText : ''}</FormHelperText>
            </FormControl>
    );
}

export default MobilePhoneNumberInput;