/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import moment from 'moment';

export const DATE_FORMAT = 'DD.MM.YYYY';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'DD.MM.YYYY HH:mm';

export let TYPES = {
    TEXTFIELD: 'TEXTFIELD',
    ID: 'ID',
    TEXTAREA: 'TEXTAREA',
    INTEGER_NUMBER: 'INTEGER_NUMBER',
    SELECT: 'SELECT',
    MULTIPLESELECT: 'MULTIPLESELECT',
    FILE: 'FILE',
    PASSWORD: 'PASSWORD',
    TIME: 'TIME',
    DATE: 'DATE',
    CUSTOM: 'CUSTOM'
};

export let VALIDATORS = {
    REQUIRED: 'REQUIRED',
    MIN_LENGTH: 'MIN_LENGTH',
    MAX_LENGTH: 'MAX_LENGTH',
    MIN: 'MIN',
    MAX: 'MAX',
    EXTENSION: 'EXTENSION',
    HOST: 'HOST',
    PORT: 'PORT',
    CUSTOM: 'CUSTOM'
};

export class DataTypeService {
    static getIdValue = (formConfig, data) => {
        let idField = formConfig.formFields.filter(f => {
            return f.type === TYPES.ID;
        })[0];
        let result = null;
        if (idField && data) {
            result = data[idField.name];
        }
        return result;
    }
    static validateField = (field, value, t, formData) => {
        let invalidFields = new Map();
        let fieldName = field.name;
        if (field.grid && field.validators) {
            field.validators.forEach(v => {
                if (v.type === VALIDATORS.CUSTOM && v.isValid) {
                    if (!v.isValid(value, formData)) {
                        invalidFields.set(fieldName, v.message);
                    }
                }
                if (v.type === VALIDATORS.REQUIRED && (value === null || value === undefined || value.length === 0)) {
                    invalidFields.set(fieldName, t('validation.required'));
                }
                if (v.type === VALIDATORS.MIN_LENGTH && (value !== null && value.length < v.length)) {
                    invalidFields.set(fieldName, t('validation.minLength', {length: v.length}));
                }
                if (v.type === VALIDATORS.MAX_LENGTH && (value !== null && value.length > v.length)) {
                    invalidFields.set(fieldName, t('validation.maxLength', {length: v.length}));
                }
                if (v.type === VALIDATORS.MIN && (value !== null && parseInt(value) < v.size)) {
                    invalidFields.set(fieldName, t('validation.min', {size: v.size}));
                }
                if (v.type === VALIDATORS.MAX && (value !== null && parseInt(value) > v.size)) {
                    invalidFields.set(fieldName, t('validation.max', {size: v.size}));
                }
                if (field.type === TYPES.FILE && v.type === VALIDATORS.EXTENSION && value && value.name) {
                    let extensions = v.extensions;
                    let parts = value.name.split('.');
                    let fileExtension = parts[parts.length - 1].toLowerCase();
                    if (!extensions.includes(fileExtension)) {
                        invalidFields.set(fieldName, t('validation.extension', {extensions: extensions.join(',')}));
                    }
                }
                if (v.type === VALIDATORS.HOST && value !== null) {
                    // eslint-disable-next-line
                    let hostRegexp = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
                    let ipRegexp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                    if (!ipRegexp.test(value) && !hostRegexp.test(value)){
                        invalidFields.set(fieldName, t('validation.invalidHostFormat'));
                    }
                }
                if (v.type === VALIDATORS.PORT && value !== null) {
                    let portRegexp = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;
                    if(!portRegexp.test(value)) {
                        invalidFields.set(fieldName, t('validation.invalidPortFormat'));
                    }
                }
            });
        }
        if (field.type === TYPES.TIME && value !== null) {
            const timeRegexp = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegexp.test(value)) {
                invalidFields.set(fieldName, t('validation.invalidTimeFormat'));
            }
        }
        return invalidFields;
    }
    static convertUIValueToServerFormat = (field, value) => {
        return value;
    }
}