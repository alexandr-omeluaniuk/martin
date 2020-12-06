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
import Drawer from '@material-ui/core/Drawer';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import { drawerWidth } from '../../conf/theme';
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";
import SessionService from '../../service/SessionService';
import { useTranslation } from 'react-i18next';
import NavItem from './NavItem';
import AppURLs from '../../conf/app-urls';
import SideNavBarDesktop from './SideNavBarDesktop';
import SideNavBarMobile from './SideNavBarMobile';

export default function SideNavBar(props) {
    const { open, setOpen, onItemSelected } = props;
    const { t } = useTranslation();
    const createSideBarNavigation = (items, parentPath, parentId, level) => {
        let navItems = [];
        items.forEach(item => {
            let childs = item.items ? createSideBarNavigation(item.items, parentPath + item.path, parentId + '.' + item.id) : null;
            if (!item.hidden) {
                navItems.push(
                        createNavItem(
                            item.id,
                            parentPath + item.path,
                            item.icon,
                            t(parentId + '.' + item.id + 'Title'),
                            childs,
                            level
                        )
                );
            }
        });
        level++;
        return navItems;
    };
    
    const createNavItem = (id, path, icon, label, childs, level) => {
        return (
            <NavItem path={path} icon={icon} label={label} onItemSelected={onItemSelected} key={path} isRoot={level === 0} itemId={id}>
                {childs}
            </NavItem>
        );
    };
    let currentModule = SessionService.currentModule();
    let moduleItems = [];
    let moduleId = null;
    let modulePath = '';
    if (currentModule) {
        moduleItems = SessionService.sideBarNavigationItems();
        moduleId = currentModule.id;
        modulePath = AppURLs.context + currentModule.path;
    }
    const navItems = createSideBarNavigation(moduleItems, modulePath, moduleId, 0);
    return (
        <React.Fragment>
            <Hidden mdUp implementation="css">
                <SideNavBarDesktopMobile open={open} setOpen={setOpen} navItems={navItems}/>
            </Hidden>
            <Hidden smDown implementation="css">
                <SideNavBarDesktop open={open} setOpen={setOpen} navItems={navItems}/>
            </Hidden>
        </React.Fragment>
    );
}
