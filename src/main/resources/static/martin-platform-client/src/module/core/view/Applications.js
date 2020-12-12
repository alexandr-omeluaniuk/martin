/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { history } from '../../../index';
import AppURLs from '../../../constants/AppURLs';
import SessionService from '../../../service/SessionService';
import DataService from '../../../service/DataService';

const dataService = new DataService();

const useStyles = makeStyles(theme => ({
    media: {
        height: 0,
        paddingTop: '36%'
    },
    paper: {
        padding: theme.spacing(3)
    }
}));

function Applications(props) {
    const classes = useStyles();
    const { t } = useTranslation();
    const [applications, setApplications] = React.useState(null);
    // ============================================================ METHODS ===============================================================
    const openApplication = (app) => {
        history.push(AppURLs.context + app.path);
        SessionService.updateSideBar();
    };
    // ============================================================ HOOKS =================================================================
    useEffect(() => {
        if (!applications) {
            dataService.requestAuthInfo().then((authData) => {
                const availableApplications = SessionService.getAvailableApplications(authData);
                setApplications(availableApplications);
            });
        } else {
            if (applications.length === 1) {
                history.push(AppURLs.context + applications[0].path);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [applications]);
    useEffect(() => {
        return () => {
            dataService.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // ============================================================ RENDERING =============================================================
    if (!applications) {
        return null;
    }
    return (
            <Container>
                <Grid container spacing={2}>
                    {applications.length === 0 ? (
                            <Grid item xs={12}>
                                <Paper elevation={1} className={classes.paper}>
                                    <Typography variant="h6" align="center" color="error">
                                        {t('error.noAvailableApplications')}
                                    </Typography>
                                </Paper>
                            </Grid>
                    ) : null}
                    {applications.map((app, idx) => {
                        return (
                            <Grid item xs={12} md={4} lg={4} key={idx}>
                                <Card raised={true} onClick={() => openApplication(app)}>
                                    <CardActionArea>
                                        <CardMedia className={classes.media} image={app.logo} title={t('module.' + app.id)}/>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {t('module.' + app.id)}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
    );
}

export default Applications;
