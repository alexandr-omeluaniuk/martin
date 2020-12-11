/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { modules } from '../conf/modules';
import AppURLs from '../conf/app-urls';
import { history } from '../index';

let commonModule = [];

class SessionService {
    /**
     * Get current module.
     * @returns {applicationModules|currentModule}
     */
    static currentModule = () => {
        let currentModule = null;
        let internalAppUrl = window.location.pathname.replace(AppURLs.context, '');
        if (internalAppUrl) {
            let moduleUrl = '/' + internalAppUrl.split('/')[1];
            currentModule = modules().filter(m => {
                return m.path === moduleUrl;
            })[0];
        }
        return currentModule;
    }
    static sideBarNavigationItems = (authData) => {
        let result = [];
        let currentModule = SessionService.currentModule(authData);
        if (!currentModule) {
            return result;
        }
        let allItems = JSON.parse(JSON.stringify(currentModule.items));
        allItems.filter(item => { return item !== null; }).forEach(item => {
            this._visitModuleItem(item, authData, result);
        });
        return result;
    }
    /**
     * Get current module item. Determined by URL.
     * @returns {SessionService@call;_visitItem}
     */
    static currentItem = (authData) => {
        let module = this.currentModule(authData);
        let path = window.location.pathname.replace(AppURLs.context, '');
        let commonItems = commonModule.filter(item => {
            return item.path === path;
        });
        if (commonItems.length > 0) {
            return commonItems[0];
        }
        if (module) {
            let currentItem = this._visitItem(module, path, '');
            if (currentItem && currentItem.visible) {
                return currentItem;
            } else {
                if (path !== '') {  // context URL detected (must be redirect)
                    //console.error('404 error: ' + path);
                    //window.location.href = AppURLs.errorPage + '/' + ERR_PAGE_NOT_FOUND;
                }
            }
        } else {
            history.push(AppURLs.context + '/queue_management');    // redirect from context URL
        }
    }
    /**
     * Get module item full ID.
     * Uses for item label translate definition.
     * @param {string} itemId
     * @returns full item ID.
     */
    static getItemFullId = (itemId) => {
        let module = this.currentModule();
        let fullId = null;
        if (module) {
            fullId = this._visitItemId(module, '', itemId);
        }
        return fullId ? fullId : ('COMMON.' + itemId);
    }
    static getAllRoutes(authData) {
        let routes = [];
        commonModule.forEach(item => {
            routes.push(
                <Route exact path={AppURLs.context + item.path} key={AppURLs.context + item.path} component={item.component}/>
            );
        });
        let rootURL = AppURLs.context;
        SessionService.getAvailableApplications(authData).forEach(module => {
            const modulePermissions = authData.permissions.module_permissions[module.id];
            setItemPermissions(module, modulePermissions ? modulePermissions.view_permissions : null, authData.is_admin);
            this._visitItemRoutes(module, routes, rootURL, authData);
        });
        return routes;
    }
    static getAvailableApplications(authData) {
        const apps = modules();
        const availableApplications = [];
        apps.forEach(a => {
            if (hasModuleAccess(authData, a)) {
                availableApplications.push(a);
            }
        });
        return availableApplications;
    };
    // ====================================================== PRIVATE =====================================================================
    static _visitItemRoutes = (item, routes, parentPath, authData) => {
        if (item !== null) {
            let itemPath = parentPath + item.path;
            if (item.component && item.visible) {
                routes.push(<Route path={itemPath} component={item.component} key={itemPath}/>);
            }
            if (item.items) {
                for (let i = 0; i < item.items.length; i++) {
                    this._visitItemRoutes(item.items[i], routes, itemPath, authData);
                }
                const visibleChilds = item.items.filter(ch => {
                    return ch && ch.visible;
                });
                if (item.visible) {
                    routes.push(
                        <Route exact path={itemPath} key={itemPath}>
                            <Redirect to={itemPath + visibleChilds[0].path}/>
                        </Route>
                    );
                }
            }
        }
    }
    static _visitItemId = (item, parentId, itemId) => {
        if (item !== null) {
            let subResult = (parentId ? parentId + '.' : '') + item.id;
            if (item.id === itemId) {
                return subResult;
            }
            if (item.items) {
                for (let i = 0; i < item.items.length; i++) {
                    let result = this._visitItemId(item.items[i], subResult, itemId);
                    if (result) {
                        return result;
                    }
                }
            }
        }
    }
    static _visitItem = (item, path, parentSubPath) => {
        if (item !== null) {
            let match;
            if (item.path.indexOf('/:') === -1) {   // for exact path
                match = parentSubPath + item.path === path;
            } else {    // for path templates
                let fullPath = (parentSubPath + item.path).trim().split('/');
                let fullPathSb = '';
                fullPath.filter(s => {
                    return s.length > 0;
                }).forEach(subPath => {
                    if (subPath.indexOf(':id') !== -1) {
                        //eslint-disable-next-line
                        fullPathSb += '\/[0-9]+';
                    } else {
                        //eslint-disable-next-line
                        fullPathSb += '\/' + subPath;
                    }
                });
                let regexp = new RegExp(fullPathSb);
                match = regexp.test(path);
            }
            if (match) {
                return item;
            }
            if (item.items) {
                for (let i = 0; i < item.items.length; i++) {
                    let result = this._visitItem(item.items[i], path, parentSubPath + item.path);
                    if (result) {
                        return result;
                    }
                }
            }
        }
    }
    static _visitModuleItem = (item, authData, result) => {
        if (item !== null) {
            if (item.items) {
                let childResult = [];
                item.items.forEach(i => {
                    this._visitModuleItem(i, authData, childResult);
                });
                item.items = childResult;
                let atLeastChildVisible = item.items.filter(i => {
                    return i.visible;
                }).length > 0;
                if (atLeastChildVisible) {
                    result.push(item);
                }
            } else {
                if (item.visible) {
                    result.push(item);
                }
            }
        }
    }
    
    static isAdmin = (authData) => {
        const mPermissions = authData.permissions.module_permissions;
        for (let moduleId in mPermissions) {
            let viewPermissions = mPermissions[moduleId].view_permissions;
            let usersPermission = viewPermissions.filter(v => {
                return v.view_id === 'users';
            });
            if (usersPermission.length > 0) {
                return true;
            }
        }
        return false;
    };
    static isOneViewAvailable = (authData) => {
        if (!authData || !authData.permissions || !authData.permissions.module_permissions) {
            return false;
        }
        const mPermissions = authData.permissions.module_permissions;
        let currentModule = SessionService.currentModule(authData);
        if (!currentModule) {
            return false;
        }
        let modulePermissions = mPermissions[currentModule.id];
        if (modulePermissions && modulePermissions.view_permissions.filter(vp => {
            return vp.view_id !== 'customerCallMonitor';
        }).length === 1) {
            return true;
        } else {
            return false;
        }
    };
}

export default SessionService;
    
const hasModuleAccess = function (authData, module) {
    if (authData.is_admin) {
        return true;
    }
    let modulePermissions = authData.permissions.module_permissions;
    return modulePermissions[module.id] ? true : false;
};

const setItemPermissions = function (item, viewPermissions, isAdmin) {
    if (item === null) {
        return;
    }
    if (viewPermissions) {
        item.visible = viewPermissions.filter(vp => {
            return vp.view_id === item.id;
        }).length > 0;
    }
    if (item.items) {
        item.items.forEach(i => {
            setItemPermissions(i, viewPermissions, isAdmin);
        });
        item.visible = item.items.filter(i => {
            return i && i.visible;
        }).length > 0;
    }
};
