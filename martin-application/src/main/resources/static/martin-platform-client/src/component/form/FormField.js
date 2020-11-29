/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { TYPES, VALIDATORS } from '../../service/DataTypeService';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import NumberField from './input/NumberField';
import Dropdown from './input/Dropdown';
import NewOptionDropdown from './input/NewOptionDropdown';
import FileUpload from './input/FileUpload';
import MultipleSelect from './input/MultipleSelect';
import TextFieldWithTranslations from './input/TextFieldWithTranslations';
import PasswordField from './input/PasswordField';
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import "moment/locale/de";

function FormField (props) {
    const { t, i18n } = useTranslation();
    const { fieldConfig, invalidFields, fieldValue, onChangeFieldValue, formData, entryId } = props;
    // ==================================================== RENDERING =====================================================================
    const renderFormField = () => {
        let name = fieldConfig.name;
        let label = fieldConfig.label ? t(fieldConfig.label) : '';
        let attributes = fieldConfig.attributes ? fieldConfig.attributes : {};
        let isRequired = fieldConfig.validators && fieldConfig.validators.filter(v => {
            return v.type === VALIDATORS.REQUIRED;
        }).length > 0;
        if (fieldConfig.type === TYPES.ID) {
            return <TextField value={fieldValue ? fieldValue : ''} name={name} />;
        } else if (fieldConfig.type === TYPES.TEXTFIELD) {
            const inputProps = {};
            if (attributes.readOnly !== undefined) {
                inputProps.readOnly = attributes.readOnly;
            }
            if (attributes.translationsName) {
                const tFieldValue = formData.get(attributes.translationsName);
                return <TextFieldWithTranslations label={label} fullWidth={true} required={isRequired}
                            onChange={onChangeFieldValue} name={name} value={fieldValue ? fieldValue : ''}
                            error={invalidFields.has(name)} helperText={invalidFields.get(name)}
                            translationsname={attributes.translationsName} translationvalue={tFieldValue ? tFieldValue : ''}/>;
            } else {
                return <TextField label={label} fullWidth={true} required={isRequired}
                            onChange={(e) => onChangeFieldValue(name, e.target.value)}
                            value={fieldValue ? fieldValue : ''} name={name} error={invalidFields.has(name)} 
                            helperText={invalidFields.get(name)} InputProps={inputProps}/>;
            }
        } else if (fieldConfig.type === TYPES.TEXTAREA) {
            return <TextField label={label} fullWidth={true} onChange={(e) => onChangeFieldValue(name, e.target.value)}
                                value={fieldValue ? fieldValue : ''} name={name} error={invalidFields.has(name)}
                                helperText={invalidFields.get(name)} multiline
                                rows={attributes.rows ? attributes.rows : 3} required={isRequired}/>;
        } else if (fieldConfig.type === TYPES.INTEGER_NUMBER) {
            return <NumberField label={label} value={fieldValue ? fieldValue : ''}
                            onChange={(e) => onChangeFieldValue(name, e.target.value)} fullWidth={true}
                            helperText={invalidFields.get(name)} required={isRequired}/>;
        } else if (fieldConfig.type === TYPES.SELECT) {
            return <Dropdown label={label} value={fieldValue ? fieldValue : ''} required={isRequired}
                            onChange={(e) => {
                                onChangeFieldValue(name, e.target.value);
                                if (attributes.onChange) {
                                    attributes.onChange(e.target.value);
                                }
                            }} fullWidth={true}
                            helperText={invalidFields.get(name)} options={attributes.options ? attributes.options : []}
                            allowEmpty={attributes.allowEmpty ? true : false}/>;
        } else if (fieldConfig.type === TYPES.SELECT_NEW_OPTION) {
            return <NewOptionDropdown label={label} value={fieldValue ? fieldValue : ''} required={isRequired}
                            onChange={(e) => onChangeFieldValue(name, e.target.value)} fullWidth={true}
                            helperText={invalidFields.get(name)} options={attributes.options ? attributes.options : []}
                            allowEmpty={attributes.allowEmpty ? true : false}
                            formConfig={attributes.formConfig ? attributes.formConfig : {}}
                            onNewOptionSubmit={attributes.onNewOptionSubmit}
                            onNewOptionDelete={attributes.onNewOptionDelete ? attributes.onNewOptionDelete : null}/>;
        } else if (fieldConfig.type === TYPES.FILE) {
            return <FileUpload label={label} onChange={onChangeFieldValue} fullWidth={true} value={fieldValue ? fieldValue : ''} 
                            helperText={invalidFields.get(name)} name={name} required={isRequired} avatar={attributes.avatar}
                            entryId={entryId}/>;
        } else if (fieldConfig.type === TYPES.PASSWORD) {
            return <PasswordField label={label} fullWidth={true} required={isRequired} type="password"
                            onChange={(e) => onChangeFieldValue(name, e.target.value)}
                            value={fieldValue ? fieldValue : ''} name={name} error={invalidFields.has(name)} 
                            helperText={invalidFields.get(name)}/>;
        } else if (fieldConfig.type === TYPES.TIME) {
            let value = fieldValue;
            if (value) {
                value = moment(value, 'HH:mm');
            } else {
                value = null;
            }
            return (
                <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} locale={i18n.language}>
                    <KeyboardTimePicker label={label} fullWidth={true} required={isRequired} clearable ampm={false} mask="__:__"
                        onChange={(date) => {
                            onChangeFieldValue(name, date !== null ? date.format('HH:mm') : null);
                        }} value={value} name={name} error={invalidFields.has(name)} 
                        helperText={invalidFields.get(name)}
                        cancelLabel={t('common.cancel')} clearLabel={t('common.clear')}
                        keyboardIcon={(<Icon>access_time</Icon>)}/>
                </MuiPickersUtilsProvider>
            );
        } else if (fieldConfig.type === TYPES.MULTIPLESELECT) {
            return <MultipleSelect label={label} options={attributes.options ? attributes.options : []} name={name}
                        value={fieldValue ? fieldValue : []} fullWidth={true} onChangeFieldValue={onChangeFieldValue}
                        required={isRequired} helperText={invalidFields.get(name)}/>;
        } else if (fieldConfig.type === TYPES.CUSTOM) {
            return fieldConfig.render(name, fieldValue, onChangeFieldValue);
        }
        return null;
    };
    return renderFormField();
}

export default FormField;
