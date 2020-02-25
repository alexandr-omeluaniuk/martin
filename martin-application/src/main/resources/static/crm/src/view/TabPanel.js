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
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Icon from '@material-ui/core/Icon';
import { useTranslation } from 'react-i18next';
import ListView from '../view/ListView';
import CalendarView from '../view/CalendarView';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        width: '100%'
    },
    tabs: {
        marginBottom: theme.spacing(2)
    }
}));

function TabPanel(props) {
    const classes = useStyles();
    const { t } = useTranslation();
    const { metadata } = props;
    // ----------------------------------------------------- STATE ------------------------------------------------------------------------
    const [activeTab, setActiveTab] = React.useState(0);
    // ----------------------------------------------------- RENDER -----------------------------------------------------------------------
    return (
            <Paper className={classes.root}>
                {metadata ? (
                    <React.Fragment>
                        <Tabs indicatorColor="secondary" textColor="secondary" value={activeTab} 
                                className={classes.tabs} onChange={(e, index) => {
                            setActiveTab(index);
                        }}>
                            {metadata.tabs.map((item, i) => {
                                const icon = (<Icon>{item.icon}</Icon>);
                                return (
                                        <Tab icon={icon} label={t('model.' + item.className + '.label.many')} key={i}></Tab>
                                );
                            })}
                        </Tabs>
                        {metadata.tabs.map((tabItem, i) => {
                            if (i === activeTab) {
                                if (tabItem.type === 'LIST_VIEW') {
                                    return (<ListView metadata={tabItem} key={i}/>);
                                } else if (tabItem.type === 'CALENDAR_VIEW') {
                                    return (<CalendarView metadata={tabItem} key={i}/>)
                                } else {
                                    return null;
                                }
                            } else {
                                return null;
                            }
                        })}
                    </React.Fragment>
                ) : null}
            </Paper>
    );
}

export default TabPanel;
