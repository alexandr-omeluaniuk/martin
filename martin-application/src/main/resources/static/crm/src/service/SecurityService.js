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

import DataService from './DataService';
import AppURLs from '../constants/AppURLs';
import Dashboard from '../view/Dashboard';
import Settings from '../view/Settings';

class SecurityService {
    static _permissions;
    
    static getPermissions = () => {
        let service = this;
        return new Promise((resolve, reject) => {
            if (service.permissions) {
                resolve(service.permissions);
            } else {
                DataService.requestGet('/security/permissions').then(resp => {
                    service.permissions = resp;
                    resolve(resp);
                });
            }
        });
    }
    
    static getNavigation = (t) => {
        let service = this;
        return new Promise((resolve, reject) => {
            service.getPermissions().then(permissions => {
                let navItems = [];
                navItems.push({
                    sideNavBar: 'dashboard',
                    icon: 'dashboard',
                    path: AppURLs.links.view + '/dashboard',
                    component: Dashboard
                });
                if (permissions) {
                    permissions.sideBarNavItems.forEach(meta => {
                        navItems.push({
                            icon: meta.icon ? meta.icon : 'help',
                            path: AppURLs.links.view + '/' + meta.path,
                            metadata: meta
                        });
                    });
                }
                navItems.push({
                    sideNavBar: 'settings',
                    icon: 'settings',
                    path: AppURLs.links.settings,
                    component: Settings,
                    hidden: true
                });
                navItems.forEach(ni => {
                    ni.label = service.translateNavItem(ni, t);
                });
                resolve(navItems);
            });
        });
    };
    
    static translateNavItem = (item, t) => {
        let label = '';
        if (item.metadata) {
            let meta = item.metadata;
            if (meta.source === 'APPLICATION_MODULE') {
                label = t('enum.ss.martin.platform.constants.ApplicationModule.' + meta.className);
            } else if (meta.source === 'ENTITY') {
                label = t('model.' + meta.className + '.label.many');
            }
        } else {
            label = t('sideNavBar.' + item.sideNavBar);
        }
        return label;
    }
}

export default SecurityService;
