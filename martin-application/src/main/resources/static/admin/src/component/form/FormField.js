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
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, /*KeyboardTimePicker,*/ KeyboardDatePicker } from '@material-ui/pickers';
import { TYPE_STRING, TYPE_DATE, TYPE_SET, TYPE_AVATAR } from '../../config/datatypes';
import { NOT_NULL, NOT_EMPTY, MOBILE_PHONE_NUMBER } from '../../config/validators';
import { useTranslation } from 'react-i18next';
import MultiChoiceInput from '../input/MultiChoiceInput';
import MobilePhoneNumberInput from '../input/MobilePhoneNumberInput';
import AvatarInput from '../input/AvatarInput';
import moment from 'moment';
import "moment/locale/ru";
import i18n from '../../config/i18next-config';

const useStyles = makeStyles(theme => ({
    fullWidth: {
        width: '100%'
    }
}));

function FormField(props) {
    const { field, entity, invalidFields, fieldValue, onChangeFieldValue } = props;
    const { t } = useTranslation();
    const classes = useStyles();
    // -------------------------------------------------- FUNCTIONS -----------------------------------------------------------------------
    const sizeOf = (val) => {
        if (val === "false") {
            return false;
        } else if (val === "true") {
            return true;
        } else if (val === "auto") {
            return val;
        } else {
            return parseInt(val);
        }
    };
    
    const renderFormField = (field) => {
        let label = t('models.' + entity + '.' + field.name);
        var isRequired = field.validators.filter(v => {
            return v.type === NOT_NULL || v.type === NOT_EMPTY;
        }).length > 0;
        label += isRequired ? ' *' : '';
        let name = field.name;
        if (field.fieldType === TYPE_STRING) {
            let isMobilePhoneNumber = field.validators.filter(v => { return v.type === MOBILE_PHONE_NUMBER; }).length > 0;
            if (isMobilePhoneNumber) {
                return (
                        <MobilePhoneNumberInput label={label} value={fieldValue ? fieldValue : ''}
                            onChange={(e) => onChangeFieldValue(name, e.target.value)} fullWidth={true}
                            helperText={invalidFields.get(name)}/>
                );
            } else {
                return (
                        <TextField label={label} fullWidth={true} onChange={(e) => onChangeFieldValue(name, e.target.value)}
                                value={fieldValue ? fieldValue : ''} name={name} error={invalidFields.has(name)}
                                helperText={invalidFields.get(name)}/>
                );
            }
        } else if (field.fieldType === TYPE_DATE) {
            moment.locale(i18n.language);
            let value = fieldValue ? fieldValue : null;
            return (
                    <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} locale={i18n.language}>
                        <KeyboardDatePicker disableToolbar variant="inline" format={t('constants.momentJsDateFormat')} margin="normal"
                            label={label} onChange={(date) => onChangeFieldValue(name, date)} name={name} value={value} autoOk={true}
                            className={classes.fullWidth} error={invalidFields.has(name)} helperText={invalidFields.get(name)}/>
                    </MuiPickersUtilsProvider>
            );
        } else if (field.fieldType === TYPE_SET) {
            let value = fieldValue ? new Set(fieldValue) : new Set();
            return (
                    <MultiChoiceInput entity={entity} field={name} label={label} genericClass={field.genericClass}
                        isEnum={field.genericClassEnum} selected={value} onChange={onChangeFieldValue}/>
            );
        } else if (field.fieldType === TYPE_AVATAR) {
            return (
                    <AvatarInput label={label} value={fieldValue ? fieldValue : ''}
                        onChange={(data) => onChangeFieldValue(name, data)}/>
            );
        }
        return null;
    };
    // -------------------------------------------------- RENDERING -----------------------------------------------------------------------
    return (
            <Grid item xs={sizeOf(field.grid.xs)} lg={sizeOf(field.grid.lg)} md={sizeOf(field.grid.md)}
                        sm={sizeOf(field.grid.sm)}>
                {renderFormField(field)}
            </Grid>
    );
}

export default FormField;