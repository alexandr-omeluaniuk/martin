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

export const SERVER_DATE_FORMAT = 'DD.MM.YYYY';

export const SERVER_DATETIME_FORMAT = 'DD.MM.YYYY HH:mm';

// ----------------------------------------------- FIELD TYPES ----------------------------------------------------------------------------
export const TYPE_STRING = 'String';

export const TYPE_DATE = "DATE";

export const TYPE_SET = "Set";

export const TYPE_AVATAR = "Avatar";

export const TYPE_TEXTAREA = "TextArea";

export const TYPE_MOBILE_PHONE_NUMBER = "MobilePhoneNumber";

export const TYPE_TIMESTAMP = "TIMESTAMP";

export const TYPE_MANY_TO_ONE = "ManyToOne";
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
        
    static renderTableCell = (entity, field, t, entityData) => {
        console.log(field);
        let value = entityData[field.id];
        console.log(value);
        let renderValue = value;
        if (field.enumField) {
            renderValue = t('enum.' + field.enumField + '.' + value);
        } else if (field.attributes && field.attributes.genericClassEnum) {
            let sb = '';
            value.forEach(v => {
                sb += t('enum.' + field.genericClass + '.' + v) + ' | ';
            });
            if (sb.length > 3) {
                sb = sb.substring(0, sb.length - 3);
            }
            renderValue = sb;
        } else if (field.layoutField.fieldType === TYPE_AVATAR) {
            renderValue = entityData.hasAvatar ?
                (<Avatar src={this.getAvatarUrl(entity, entityData.id)}>
                    <Icon>perm_identity</Icon>
                </Avatar>) : (<Avatar><Icon>perm_identity</Icon></Avatar>);
        } else if (field.layoutField.attributes && field.layoutField.attributes.lookupFieldTemplate) {
            renderValue = this.renderLookupField(field.layoutField, value);
            console.log(renderValue);
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
        } else if (field.fieldType === TYPE_TIMESTAMP) {
            result = moment(value).format(SERVER_DATETIME_FORMAT);
        } else if (field.fieldType === TYPE_AVATAR) {
            result = value ? {
                id: null,
                binaryData: value.indexOf(',') !== -1 ? value.split(',')[1] : value,
                mimeType: value.indexOf(',') !== -1 ? value.split(',')[0] : value
            } : null
        }
        return result;
    }
    
    static convertServerValueToUIFormat = (field, data, entity) => {
        let value = data[field.name];
        if (field.fieldType === TYPE_DATE) {
            value = moment(value, SERVER_DATE_FORMAT);
        } else if (field.fieldType === TYPE_TIMESTAMP) {
            value = moment(value, SERVER_DATETIME_FORMAT);
        } else if (field.fieldType === TYPE_STRING) {
            value = value === null || value === undefined ? '' : value;
        } else if (field.fieldType === TYPE_AVATAR) {
            value = data.hasAvatar ? this.getAvatarUrl(entity, data.id) : null;
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
    
    static renderLookupField = (field, value) => {
        let label = '';
        if (value) {
            let template = field.attributes.lookupFieldTemplate ? field.attributes.lookupFieldTemplate : 'No lookup template!!!';
            for (let k in value) {
                template = template.replace('{' + k + '}', value[k]);
            }
            label = template;
        }
        return label;
    };
    
    static getAvatarUrl = (entity, id, withTimestamp) => {
        return AppURLs.links.rest + '/entity/avatar/' + entity + '/' + id + (withTimestamp ? ('?timestamp=' + new Date().getTime()) : '');
    }
}
