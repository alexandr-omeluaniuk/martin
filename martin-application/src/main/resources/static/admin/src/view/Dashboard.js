/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Icon from '@material-ui/core/Icon';
import DataService from '../service/DataService';
import SecurityService from '../service/SecurityService';
import { useTranslation } from 'react-i18next';
import ListView from '../view/ListView';

const useStyles = makeStyles(theme => ({
        root: {
            padding: theme.spacing(2),
            width: '100%'
        }
    }));

function Dashboard(props) {
    const classes = useStyles();
    const { t } = useTranslation();
    // ----------------------------------------------------- STATE ------------------------------------------------------------------------
    const [navItems, setNavItems] = React.useState(null);
    const [activeTab, setActiveTab] = React.useState(0);
    // ----------------------------------------------------- HOOKS ------------------------------------------------------------------------
    useEffect(() => {
        if (!navItems) {
            SecurityService.getPermissions().then(permissions => {
                setNavItems(permissions.dashboardTabItems);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navItems]);
    useEffect(() => {
        return () => {
            DataService.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // ----------------------------------------------------- RENDER -----------------------------------------------------------------------
    return (
            <Paper className={classes.root}>
                {navItems ? (
                    <React.Fragment>
                        <Tabs indicatorColor="secondary" textColor="secondary" value={activeTab} onChange={(e, index) => {
                            setActiveTab(index);
                        }}>
                            {navItems.map((item, i) => {
                                const icon = (<Icon>{item.icon}</Icon>);
                                return (
                                        <Tab icon={icon} label={t('models.titles.many.' + item.className)} key={i}></Tab>
                                );
                            })}
                        </Tabs>
                        {navItems.map((item, i) => {
                            return (
                                    <ListView metadata={item} key={i}/>
                            );
                        })}
                    </React.Fragment>
                ) : null}
            </Paper>
    );
}

export default Dashboard;
