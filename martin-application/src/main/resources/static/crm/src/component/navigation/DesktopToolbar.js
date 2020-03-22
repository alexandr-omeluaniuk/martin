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

/* global fetch */

import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { drawerWidth } from '../../constants/style';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useTranslation } from 'react-i18next';
import AppURLs from '../../constants/AppURLs';
import { history } from '../../index';
import { NavLink } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    toolbar: {
        paddingRight: 24 // keep right padding when drawer closed
    },
    menuButton: {
        marginRight: 36
    },
    menuButtonHidden: {
        display: 'none'
    },
    title: {
        flexGrow: 1
    },
    titleIcon: {
        minWidth: '30px'
    },
    menuIcon: {
        minWidth: '30px'
    },
    navLink: {
        textDecoration: 'none',
        color: 'inherit'
    }
}));

const menuId = 'account-menu-id';

function DesktopToolbar(props) {
    const { t } = useTranslation();
    const classes = useStyles();
    const { title, open, setOpen, fullname, icon, hasAvatar, userId } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);
    
    const handleProfileMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    
    const logout = () => {
        let promise = fetch(AppURLs.links.logout, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            if (response.ok) {
                window.location.href = AppURLs.links.welcome;
            }
        }).catch(error => {
            console.error('HTTP error occurred: ' + error);
        });
        promise.then(rsp => {});
    };
    
    const renderMenu = (
            <Menu anchorEl={anchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} id={menuId} keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={isMenuOpen} onClose={handleMenuClose}>
                <MenuItem disabled={true}><Typography variant="caption">{fullname}<hr/></Typography></MenuItem>
                <NavLink to={AppURLs.links.settings} className={classes.navLink}>
                    <MenuItem onClick={() => {
                        history.push(AppURLs.links.settings);
                        setAnchorEl(null);
                    }}><Icon className={classes.menuIcon}>settings</Icon> {t('toolbar.accountmenu.settings')}</MenuItem>
                </NavLink>
                <MenuItem onClick={logout}><Icon className={classes.menuIcon}>power_settings_new</Icon> {t('toolbar.accountmenu.logout')}</MenuItem>
            </Menu>
    );
    // ---------------------------------------------------- HOOKS -------------------------------------------------------------------------
    
    // ---------------------------------------------------- RENDER ------------------------------------------------------------------------
    return (
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={() => {setOpen(true);}}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}>
                        <Icon>menu</Icon>
                    </IconButton>
                    {icon ? (<Icon className={classes.titleIcon}>{icon}</Icon>) : null}
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        { title }
                    </Typography>
                    <IconButton color="inherit">
                        <Badge badgeContent={4} color="secondary">
                            <Icon>notifications</Icon>
                        </Badge>
                    </IconButton>
                    <IconButton edge="end" aria-label="account of current user" aria-controls={menuId} aria-haspopup="true"
                            onClick={handleProfileMenuOpen} color="inherit">
                            {hasAvatar 
                                ? <Avatar src={AppURLs.links.rest + '/entity/avatar/ss.martin.platform.entity.SystemUser/' + userId}/> 
                                : <Icon>account_circle</Icon>}
                    </IconButton>
                    { renderMenu }
                </Toolbar>
            </AppBar>
    );
}

export default DesktopToolbar;
