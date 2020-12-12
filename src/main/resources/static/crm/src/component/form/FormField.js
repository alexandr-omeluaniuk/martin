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
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, /*KeyboardTimePicker,*/ KeyboardDatePicker, DateTimePicker } from '@material-ui/pickers';
import { DataTypes, V_NOT_NULL, V_NOT_EMPTY } from '../../service/DataTypeService';
import { useTranslation } from 'react-i18next';
import EnumMultiChoiceInput from '../input/EnumMultiChoiceInput';
import MobilePhoneNumberInput from '../input/MobilePhoneNumberInput';
import AvatarInput from '../input/AvatarInput';
import LookupField from '../input/LookupField';
import moment from 'moment';
import "moment/locale/ru";
import "moment/locale/de";

const useStyles = makeStyles(theme => ({
    fullWidth: {
        width: '100%'
    }
}));

function FormField(props) {
    const { field, entity, invalidFields, fieldValue, onChangeFieldValue, onFieldEdit} = props;
    const { t, i18n } = useTranslation();
    const classes = useStyles();
    const inputRef = React.useRef();
    // ----------------------------------------------------- STATE ------------------------------------------------------------------------
    const [readOnly, setReadOnly] = React.useState(onFieldEdit ? true : false);
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
    
    const editButton = () => {
        return onFieldEdit ? (
                <InputAdornment position="end">
                    <IconButton disabled={!readOnly} onClick={() => {
                        if (readOnly) {
                            setReadOnly(false);
                            inputRef.current.focus();
                        }
                    }}>
                        <Icon>edit</Icon>
                    </IconButton>
                </InputAdornment>
        ) : null;
    };
    
    const commitChanges = (event) => {
        if (onFieldEdit) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            setReadOnly(true);
            onFieldEdit(field, fieldValue);
        }
    };
    
    const onBlurInput = (event) => {
        commitChanges(event);
    };
    
    const onEnterInput = (event) => {
        if (event.keyCode === 13) {
            commitChanges(event);
        }
    };
    
    const renderFormField = (field) => {
        let label = t('model.' + entity + '.field.' + field.name);
        let dataType = field.dataType;
        var isRequired = field.validators.filter(v => {
            return v.type === V_NOT_NULL || v.type === V_NOT_EMPTY;
        }).length > 0;
        label += isRequired ? ' *' : '';
        let name = field.name;
        if (dataType === DataTypes.STRING) {
            return (
                    <TextField label={label} fullWidth={true} onChange={(e) => onChangeFieldValue(name, e.target.value)}
                            value={fieldValue ? fieldValue : ''} name={name} error={invalidFields.has(name)} inputRef={inputRef}
                            helperText={invalidFields.get(name)} InputProps={{endAdornment: editButton(), readOnly: readOnly}}
                            onBlur={onBlurInput} onKeyUp={onEnterInput}/>
            );
        } else if (dataType === DataTypes.DATE) {
            moment.locale(i18n.language);
            let value = fieldValue ? fieldValue : null;
            return (
                    <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} locale={i18n.language}>
                        <KeyboardDatePicker disableToolbar variant="inline" format={t('constants.momentJsDateFormat')} margin="normal"
                            label={label} onChange={(date) => onChangeFieldValue(name, date)} name={name} value={value} autoOk={true}
                            className={classes.fullWidth} error={invalidFields.has(name)} helperText={invalidFields.get(name)}/>
                    </MuiPickersUtilsProvider>
            );
        } else if (dataType === DataTypes.ENUM_COLLECTION) {
            let value = fieldValue ? new Set(fieldValue) : new Set();
            return (
                    <EnumMultiChoiceInput entity={entity} fieldName={name} label={label} genericClass={field.attributes.GENERIC_TYPE}
                        selected={value} onChange={onChangeFieldValue}/>
            );
        } else if (dataType === DataTypes.AVATAR) {
            return (
                    <AvatarInput label={label} value={fieldValue ? fieldValue : ''}
                        onChange={(data) => onChangeFieldValue(name, data)}/>
            );
        } else if (dataType === DataTypes.TEXTAREA) {
            if (!readOnly) {
                inputRef.current.value='';  // prevent bug with readonly attribute for textarea
            }
            return (
                    <TextField label={label} fullWidth={true} onChange={(e) => onChangeFieldValue(name, e.target.value)}
                                value={fieldValue ? fieldValue : ''} name={name} error={invalidFields.has(name)} inputRef={inputRef}
                                helperText={invalidFields.get(name)} InputProps={{endAdornment: editButton(), readOnly: readOnly}}
                                onBlur={onBlurInput} onKeyUp={onEnterInput} multiline rows={field.attributes.TEXTAREA_ROWS}/>
            );
        } else if (dataType === DataTypes.MOBILE_PHONE_NUMBER) {
            return (
                    <MobilePhoneNumberInput label={label} value={fieldValue ? fieldValue : ''} inputRef={inputRef}
                            onChange={(e) => onChangeFieldValue(name, e.target.value)} fullWidth={true}
                            helperText={invalidFields.get(name)} endAdornment={editButton()} readOnly={readOnly}
                            onBlur={onBlurInput} onKeyUp={onEnterInput}/>
            );
        } else if (dataType === DataTypes.DATETIME) {
            return (
                    <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} locale={i18n.language}>
                        <DateTimePicker value={fieldValue ? fieldValue : null} onChange={(date) => onChangeFieldValue(name, date)}
                            autoOk={true} label={label} ampm={false} showTodayButton={true} className={classes.fullWidth}
                            format={t('constants.momentJsDateTimeFormat')} clearLabel={t('common.clear')}
                            cancelLabel={t('common.cancel')} todayLabel={t('common.today')}/>
                    </MuiPickersUtilsProvider>
            );
        } else if (dataType === DataTypes.LOOKUP) {
            return (
                    <LookupField field={field} value={fieldValue} label={label} onChange={onChangeFieldValue} 
                        helperText={invalidFields.get(name)} name={name} error={invalidFields.has(name)} readOnly={readOnly}/>
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