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
import { useTranslation } from 'react-i18next';
import InlineTabHeader from '../component/util/InlineTabHeader';
import Theming from '../component/settings/Theming';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        width: '100%'
    }
}));

function Settings(props) {
    const classes = useStyles();
    const { t } = useTranslation();
    // ----------------------------------------------------- STATE ------------------------------------------------------------------------
    const [activeTab, setActiveTab] = React.useState(0);
    // ----------------------------------------------------- RENDER -----------------------------------------------------------------------
    return (
            <Paper className={classes.root}>
                <React.Fragment>
                    <Tabs indicatorColor="secondary" textColor="secondary" value={activeTab} 
                            className={classes.tabs} onChange={(e, index) => {
                        setActiveTab(index);
                    }}>
                        <Tab label={(<InlineTabHeader icon={'equalizer'} title={t('settings.userInterface')}/>)}/>
                    </Tabs>
                    <Theming />
                </React.Fragment>
            </Paper>
    );
}

export default Settings;
