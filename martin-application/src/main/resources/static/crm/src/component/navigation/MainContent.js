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
import { Switch, Route, Redirect } from "react-router-dom";
import AppURLs from '../../constants/AppURLs';
import Copyright from '../Copyright';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import ListView from '../../view/ListView';
import TabPanel from '../../view/TabPanel';
import EntityCard from '../../view/EntityCard';
import background from '../../assets/main-background.jpg';

const useStyles = makeStyles(theme => ({
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        "&:after": {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: "-1",
            content: '""',
            display: "block",
            opacity: "1",
            backgroundImage: 'url(' + background + ')',
            backgroundSize: "cover",
            backgroundPosition: "center center"
        }
    },
    appBarSpacer: theme.mixins.toolbar,
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        maxWidth: 'none'
    }
}));

function MainContent(props) {
    const classes = useStyles();
    const { navItems } = props;
    if (!navItems) {
        return null;
    }
    let routes = (
        <Switch>
            <Route exact path={AppURLs.context}>
                <Redirect to={AppURLs.links.view + '/dashboard'}/>
            </Route>
            {navItems.map((prop, key) => {
                if (prop.metadata) {
                    return (
                        <Route path={prop.path} render={() => {
                            if (prop.metadata.type === 'LIST_VIEW') {
                                return (<ListView metadata={prop.metadata}/>);
                            } else if (prop.metadata.type === 'TAB_PANEL') {
                                return (<TabPanel metadata={prop.metadata}/>);
                            } else {
                                return null;
                            }
                        }} key={key}/>
                    );
                } else {
                    return (
                        <Route path={prop.path} component={prop.component} key={key}/>
                    );
                }
            })}
            <Route path={AppURLs.links.entity + '/:entity/:id'} component={EntityCard}/>
        </Switch>
    );
    return (
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container} id="main-container">
                    { routes }
                    <Box pt={4}>
                        <Copyright />
                    </Box>
                </Container>
            </main>
    );
}

export default MainContent;