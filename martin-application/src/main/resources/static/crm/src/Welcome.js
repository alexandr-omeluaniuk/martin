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

import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Copyright from './component/Copyright';
import { useTranslation } from 'react-i18next';
import AppURLs from './constants/AppURLs';
import { history } from './index';
import { V_REGEX_EMAIL } from './service/DataTypeService';
import background from './assets/main-background.jpg'

const useStyles = makeStyles(theme => ({
    background: {
        backgroundImage: 'url(' + background + ')',
        backgroundSize: "cover",
        backgroundPosition: "center center",
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(4),
        backgroundColor: '#ffffffed'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    langIcon: {
        marginRight: theme.spacing(1)
    },
    fullWidth: {
        width: '100%'
    }
}));

export default function Welcome() {
    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const anchorRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [loginError, setLoginError] = useState('');
    const validate = (e, p) => {
        let isPasswordValid = p && p.length >= 8;
        let isEmailValid = V_REGEX_EMAIL.test(e);
        setEmailValid(isEmailValid);
        setPasswordValid(isPasswordValid);
        setLoginError('');
        return isPasswordValid && isEmailValid;
    };
    const login = () => {
        if (validate(email, password)) {
            let promise = fetch(AppURLs.links.login, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: email,
                    password: password
                })
            }).then(function(response) {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 401) {
                    return response.json();
                }
            }).catch(error => {
                console.error('HTTP error occurred: ' + error);
            });
            promise.then(rsp => {
                if (rsp) {
                    if (rsp.success) {
                        history.push(AppURLs.context);
                    } else {
                        let msg;
                        if (rsp.code === '1') {
                            msg = t('loginPage.err.userNotFound');
                        } else if (rsp.code === '2') {
                            msg = t('loginPage.err.badPassword');
                        } else if (rsp.code === '3') {
                            msg = t('loginPage.err.userDeactivated');
                        }
                        setLoginError(msg);
                    }
                }
            });
        }
    };
    const handleClose = event => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setOpen(false);
    };
    const languagePicker = () => {
        let languages = i18n.options.whitelist.filter(l => { return l !== 'cimode'; });
        return (
                <Box mb={2} className={classes.fullWidth}>
                    <ButtonGroup variant="contained" color="secondary" ref={anchorRef} className={classes.fullWidth}>
                        <Button className={classes.fullWidth} onClick={() => setOpen(!open)}>
                            <Icon className={classes.langIcon}>g_translate</Icon> {t('language.' + i18n.language)}
                        </Button>
                        <Button color="secondary" size="small" aria-controls={open ? 'split-button-menu' : undefined} 
                                aria-expanded={open ? 'true' : undefined} onClick={() => setOpen(!open)}>
                            <Icon>arrow_drop_down</Icon>
                        </Button>
                    </ButtonGroup>
                    <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                            <Grow {...TransitionProps} className={classes.fullWidth} style={{
                                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                            }}>
                                <Paper className={classes.fullWidth}>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList className={classes.fullWidth}>
                                            {languages.map((option, index) => (
                                                <MenuItem key={index} selected={i18n.language === option} className={classes.fullWidth}
                                                    onClick={event => changeLanguage(option)}>
                                                    {t('language.' + option)}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Box>
        );
    };
    return (
            <div className={classes.background}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                {languagePicker()}
                <Paper className={classes.paper} elevation={4}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        { t('loginPage.signIn') }
                    </Typography>
                    <Typography component="h1" variant="h6" align="center" color="error">
                        {loginError}
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField variant="outlined" margin="normal" required fullWidth id="email" label={t('loginPage.emailAddress')}
                            name="email" autoComplete="email" autoFocus value={email} onChange={(e) => {
                                setEmail(e.target.value);
                                validate(e.target.value, password);
                            }} helperText={emailValid ? null : t('validation.email')} error={!emailValid}/>
                        <TextField variant="outlined" margin="normal" required fullWidth name="password" label={t('loginPage.password')}
                            type="password" id="password" autoComplete="current-password" value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                validate(email, e.target.value);
                            }} helperText={passwordValid ? null : t('validation.minLength', {length: 8})} error={!passwordValid}/>
                        <Button type="button" fullWidth variant="contained" color="primary" className={classes.submit} onClick={login}>
                            { t('loginPage.signIn') }
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    { t('loginPage.forgotPassword') }
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                    <Box mt={8}>
                        <Copyright />
                    </Box>
                </Paper>
            </Container>
            </div>
    );
}
