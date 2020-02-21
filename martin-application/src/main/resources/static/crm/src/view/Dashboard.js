/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CalendarView from './CalendarView';

const useStyles = makeStyles(theme => ({
        root: {
            padding: theme.spacing(2),
            width: '100%'
        }
    }));

function Dashboard(props) {
    const classes = useStyles();
    // ----------------------------------------------------- RENDER -----------------------------------------------------------------------
    return (
            <Paper className={classes.root}>
                <CalendarView/>
            </Paper>
    );
}

export default Dashboard;
