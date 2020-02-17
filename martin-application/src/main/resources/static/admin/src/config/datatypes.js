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

export const TYPE_STRING = 'String';

export const TYPE_DATE = 'DATE';

export const TYPE_SET = "Set";

export const TYPE_AVATAR = "Avatar";

export const renderTableCell = (fieldMeta, value, t) => {
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
};

export const renderLinkTableCell = (entity, entityData, cellValue) => {
    let link = AppURLs.links.entity + '/' + entity + '/' + entityData.id;
    return (
            <NavLink to={link}>{cellValue}</NavLink>
    );
};

export const convertUIValue = (field, value, oldValue) => {
    let result = value;
    if (field.fieldType === TYPE_SET) {
        let arr = oldValue;
        if (arr.includes(value)) {
            arr = arr.filter(v => { return v !== value; });
        } else {
            arr.push(value);
        }
        result = arr;
    }
    return result;
};
