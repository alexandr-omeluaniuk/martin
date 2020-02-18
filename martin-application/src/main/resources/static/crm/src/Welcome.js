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
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Copyright from './component/Copyright';
import { useTranslation } from 'react-i18next';
import AppURLs from './constants/AppURLs';
import { history } from './index';
import { REGEX_EMAIL } from './config/validators';
import background from './assets/login-background.jpg'

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
    }
}));

export default function Welcome() {
    const classes = useStyles();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [loginError, setLoginError] = useState('');
    const validate = (e, p) => {
        let isPasswordValid = p && p.length >= 8;
        let isEmailValid = REGEX_EMAIL.test(e);
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
    return (
            <div className={classes.background}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
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
