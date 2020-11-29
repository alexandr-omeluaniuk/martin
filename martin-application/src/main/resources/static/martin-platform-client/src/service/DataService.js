/* 
 * Copyright (C) 2018 Wisent Media
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import AppURLs from '../conf/app-urls';
import { history } from '../index';

export const CONTENT_TYPE_FORM = 'application/x-www-form-urlencoded; charset=UTF-8';

export const CONTENT_TYPE_MULTIPART = 'multipart/form-data';

export const CONTENT_TYPE_JSON = 'application/json';

export const REQUEST_ERROR = 'REQUEST_ERROR';

let authInfo = null;

let jwt = null;

let _showNotification;

class DataService {
    constructor() {
        this.abortController = new AbortController();
    }
    
    static setJWT = (newJwt) => {
        jwt = newJwt;
    };

    static setNotification(func) {
        _showNotification = func;
    }
    static showNotification = (message, details, type, duration) => {
        _showNotification(message, details, type, duration);
    }
    static toFormString = (data) => {
        let sb = '';
        for (let k in data) {
            sb += `${k}=${data[k] === null ? '' : data[k]}&`;
        }
        return sb;
    };
    static logout = () => {
        authInfo = null;
        jwt = null;
        window.location.href = AppURLs.welcome;
    };
    requestAuthInfo = () => {
        return new Promise((resolve, reject) => {
            if (authInfo) {
                resolve(authInfo);
            } else {
                fetch(AppURLs.api + '/anonym/openapi/authInfo', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }
                }).catch(error => {
                    console.error('HTTP error occurred: ' + error);
                }).then(rsp => {
                    jwt = rsp.data.jwt;
                    authInfo = rsp.data;
                    if (authInfo.role_id !== "-1") {
                    }
                    if (!jwt) {
                        authInfo = null;
                        history.push(AppURLs.welcome);
                    } else {
                        if (!authInfo.permissions || !authInfo.permissions.module_permissions
                                || authInfo.permissions.module_permissions.length === 0) {
                        }
                    }
                    resolve(rsp.data);
                });
            }
        });
    }
    requestGet = (url) => {
        return this.request('GET', url);
    }
    requestPut = (url, data) => {
        return this.request('PUT', url, data);
    }
    requestPost = (url, data) => {
        return this.request('POST', url, data);
    }
    requestDelete = (url) => {
        return this.request('DELETE', url);
    }
    abort = () => {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = new AbortController();
        }
    }
    request = (method, url, payload, contentType) => {
        contentType = contentType ? contentType : CONTENT_TYPE_JSON;
        let signal = this.abortController.signal;
        if (payload && payload instanceof Object && contentType === CONTENT_TYPE_FORM) {
            let formData = '';
            for (let k in payload) {
                formData += 'data[' + k + ']=' + payload[k] + '&';
            }
            payload = formData;
        }
        let headers = {
            'Authorization': jwt ? ('Bearer ' + jwt) : ''
        };
        if (contentType !== CONTENT_TYPE_MULTIPART) {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = contentType;
        }
        return fetch(AppURLs.api + url, {
            method: method,
            signal: signal,
            headers: headers,
            body: payload ? (contentType === CONTENT_TYPE_JSON ? JSON.stringify(payload) : payload) : null
        }).then(function (response) {
            if (response.ok || response.status === 422) {
                return response.json();
            } else if (response.status === 401) {
                history.push(AppURLs.welcome); // To login page
            } else {
                response.json().then(errJson => {
                    console.log(errJson);
                    if (_showNotification) {
                        _showNotification(errJson.msg ? errJson.msg : errJson.data.msg, null, 'error');
                    }
                });
            }
        }).catch(error => {
            console.error('HTTP error occurred: ' + error);
        }).then(jsondata => {
            if (jsondata && jsondata.msg && _showNotification) {
                let message = null;
                if (jsondata.msg) {
                    message = jsondata.msg;
                } else if (jsondata.data && jsondata.data.msg) {
                    message = jsondata.data.msg;
                }
                if (message) {
                    _showNotification(message, null, jsondata.code === 3 ? 'success' : 'warning');
                }
            }
            return new Promise(resolve => {
                if (jsondata) {
                    resolve(jsondata.code === 3 ? jsondata.data : REQUEST_ERROR);
                } else {
                    resolve(REQUEST_ERROR);
                }
            });
        });
    }
    requestFile = (url, payload) => {
        let filename = 'file';
        let signal = this.abortController.signal;
        fetch(AppURLs.api + url, {
            method: 'POST',
            signal: signal,
            body: payload,
            headers: {
                'Authorization': jwt ? ('Bearer ' + jwt) : ''
            }
        }).then(function (response) {
            response.headers.forEach(function(val, key) {
                if (key === 'content-disposition') {
                    if (val.indexOf("''") !== -1) {
                        filename = val.split("''")[1];
                    }
                }
            });
            let blob = response.blob();
            return blob;
        }).then(b => {
            var url = window.URL.createObjectURL(b);
            var a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();    
            a.remove();  //afterwards we remove the element again
        });
    }
}

export default DataService;
