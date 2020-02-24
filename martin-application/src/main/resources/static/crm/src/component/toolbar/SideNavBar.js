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
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Tooltip from '@material-ui/core/Tooltip';
import { NavLink } from "react-router-dom";
import { drawerWidth } from '../../constants/style';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
    navLink: {
        textDecoration: 'none',
        color: 'inherit'
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9)
        }
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar
    }
}));

export default function SideNavBar(props) {
    const { t } = useTranslation();
    const classes = useStyles();
    const { navItems , open, setOpen, onItemSelected} = props;
    const createSideBarNavigation = () => {
        if (!navItems) {
            return null;
        }
        return (
                <div>
                    {navItems.map((item, i) => {
                        let label = '';
                        if (item.metadata) {
                            let meta = item.metadata;
                            if (meta.source === 'APPLICATION_MODULE') {
                                label = t('enum.ApplicationModule.' + meta.className);
                            } else if (meta.source === 'ENTITY') {
                                label = t('model.' + meta.className + '.label.many');
                            }
                        } else {
                            label = t('sideNavBar.' + item.sideNavBar);
                        }
                        return (
                            <NavLink to={item.path} key={i} className={classes.navLink} onClick={() => {
                                onItemSelected(item);
                            }}>
                                <ListItem button selected={window.location.pathname === item.path}>
                                    <Tooltip title={label}>
                                        <ListItemIcon>
                                            <Icon>{item.icon}</Icon>
                                        </ListItemIcon>
                                    </Tooltip>
                                    <ListItemText primary={label} />
                                </ListItem>
                            </NavLink>
                        );
                    })}
                </div>
        );
    };
    
    return (
            <Drawer variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
                }} open={open}>
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={() => {setOpen(false);}}>
                        <Icon>chevron_left</Icon>
                    </IconButton>
                </div>
                <Divider />
                <List>{createSideBarNavigation()}</List>
            </Drawer>
    );
}
