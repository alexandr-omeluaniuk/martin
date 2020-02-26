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
import { NavLink } from "react-router-dom";
import AppURLs from '../constants/AppURLs';
import moment from 'moment';
import "moment/locale/ru";

const SERVER_DATE_FORMAT = 'DD.MM.YYYY';

const SERVER_DATETIME_FORMAT = 'DD.MM.YYYY HH:mm';

// ----------------------------------------------- FIELD TYPES ----------------------------------------------------------------------------
export const TYPE_STRING = 'String';

export const TYPE_DATE = 'DATE';

export const TYPE_SET = "Set";

export const TYPE_AVATAR = "Avatar";

export const TYPE_TEXTAREA = 'TextArea';

export const TYPE_MOBILE_PHONE_NUMBER = 'MobilePhoneNumber';

export const TYPE_TYPESTAMP = 'TIMESTAMP';
// ----------------------------------------------- VALIDATORS -----------------------------------------------------------------------------
export const V_REGEX_EMAIL = /\S+@\S+\.\S+/;

export const V_REGEX_MOBILE_PHONE_NUMBER = /(^$|^[+]{1}[0-9]{3}[\s]{1}[0-9]{2}[\s]{1}[0-9]{3}[\s]{1}[0-9]{2}[\s]{1}[0-9]{2}$)/;

export const V_NOT_NULL = 'NotNull';

export const V_NOT_EMPTY = 'NotEmpty';

export const V_SIZE = 'Size';

export const V_EMAIL = 'Email';

export const V_MOBILE_PHONE_NUMBER = 'MobilePhoneNumber';
// ----------------------------------------------------------------------------------------------------------------------------------------

export default class DataTypeService {
        
    static renderTableCell = (fieldMeta, value, t) => {
        let renderValue = value;
        if (fieldMeta.enumField) {
            renderValue = t('enum.' + fieldMeta.enumField + '.' + value);
        } else if (fieldMeta.genericClassEnum) {
            let sb = '';
            value.forEach(v => {
                sb += t('enum.' + fieldMeta.genericClass + '.' + v) + ' | ';
            });
            if (sb.length > 3) {
                sb = sb.substring(0, sb.length - 3);
            }
            renderValue = sb;
        } else if (fieldMeta.layoutField.fieldType === TYPE_AVATAR) {
            renderValue = value ? (<Avatar src={value} />) : (<Avatar><Icon>perm_identity</Icon></Avatar>);
        }
        return renderValue;
    }
    
    static renderLinkTableCell = (entity, entityData, cellValue) => {
        let link = AppURLs.links.entity + '/' + entity + '/' + entityData.id;
        return (
                <NavLink to={link}>{cellValue}</NavLink>
        );
    }
    
    static convertUIValueToServerFormat = (field, value) => {
        let result = value;
        if (field.fieldType === TYPE_DATE) {
            result = value.format(SERVER_DATE_FORMAT);
        } else if (field.fieldType === TYPE_TYPESTAMP) {
            result = moment(value).format(SERVER_DATETIME_FORMAT);
        }
        return result;
    }
    
    static convertServerValueToUIFormat = (field, value) => {
        if (field.fieldType === TYPE_DATE) {
            value = moment(value, SERVER_DATE_FORMAT);
        } else if (field.fieldType === TYPE_TYPESTAMP) {
            value = moment(value, SERVER_DATETIME_FORMAT);
        } else if (field.fieldType === TYPE_STRING) {
            value = value === null || value === undefined ? '' : value;
        }
        return value;
    }
    
    static validateField = (field, value, t) => {
        let invalidFields = new Map();
        let fieldName = field.name;
        field.validators.forEach(v => {
            if (v.type === V_NOT_NULL && (value === null || value === undefined)) {
                invalidFields.set(fieldName, t('validation.notnull'));
            }
            if (v.type === V_NOT_EMPTY && (value === null || value === undefined || value.length === 0)) {
                invalidFields.set(fieldName, t('validation.notempty'));
            }
            if (v.type === V_SIZE && value && (value.length > v.attributes.max)) {
                invalidFields.set(fieldName, t('validation.maxLength', {length: v.attributes.max}));
            }
            if (v.type === V_SIZE && value && (value.length < v.attributes.min)) {
                invalidFields.set(fieldName, t('validation.minLength', {length: v.attributes.min}));
            }
            if (v.type === V_EMAIL && value && !V_REGEX_EMAIL.test(value)) {
                invalidFields.set(fieldName, t('validation.email'));
            }
            if (v.type === V_MOBILE_PHONE_NUMBER && value && !V_REGEX_MOBILE_PHONE_NUMBER.test(value)) {
                invalidFields.set(fieldName, t('validation.phone'));
            }
        });
        return invalidFields;
    }
}
