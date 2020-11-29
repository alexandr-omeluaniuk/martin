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

import React, { useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Copyright from '../component/Copyright';
import { useTranslation } from 'react-i18next';
import Form from '../component/form/Form';
import { TYPES, VALIDATORS } from '../service/DataTypeService'
import DataService from '../service/DataService';
import { history } from '../index';
import AppURLs from '../conf/app-urls';

let dataService = new DataService();

const useStyles = makeStyles(theme => ({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        "&:after": {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: "-1",
            content: '""',
            display: "block",
            opacity: ".3",
            //backgroundImage: 'url(' + backgroundImage + ')',
            backgroundSize: "cover",
            backgroundPosition: "center center"
        }
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main
    }
}));

export default function Welcome() {
    const classes = useStyles();
    const { t } = useTranslation();
    useEffect(() => {
        return () => {
            dataService.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const doLogin = (data) => {
        dataService.request('POST', '/anonym/openapi/login', DataService.toFormString(data)).then(resp => {
            if (resp.jwt) {
                DataService.setJWT(resp.jwt);
                history.push(AppURLs.context + '/queue_management');
                dataService.request('POST', '/ota/aufrufanlage/autologinToPlace');
            }
        });
    };
    
    let loginFormConfig = {
        submit: {
            label: t('component.welcomePage.btnLabel'),
            icon: 'check_circle',
            variant: 'contained',
            color: "primary"
        },
        formFields: [{
                type: TYPES.TEXTFIELD,
                name: 'username',
                label: 'common.username',
                grid: {
                    xs: 12
                },
                validators: [{
                        type: VALIDATORS.REQUIRED
                    }]
            }, {
                type: TYPES.PASSWORD,
                name: 'password',
                label: 'common.password',
                grid: {
                    xs: 12
                },
                validators: [{
                    type: VALIDATORS.REQUIRED
                }]
            }]
    };
    
    let avatar = () => {
        return (
                <Avatar className={classes.avatar}>
                    <Icon>lock</Icon>
                </Avatar>
        );
    };
    
    return (
            <div className={classes.background}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Card raised>
                        <CardHeader avatar={avatar()} title={(<Typography variant="h5">{t('component.welcomePage.title')}</Typography>)}/>
                        <CardContent>
                            <Form onSubmitAction={doLogin} formConfig={loginFormConfig}/>
                        </CardContent>
                    </Card>
                    <Box mt={8}>
                        <Copyright />
                    </Box>
                </Container>
            </div>
    );
}
