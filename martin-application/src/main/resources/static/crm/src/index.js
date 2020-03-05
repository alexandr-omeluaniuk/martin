import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Welcome from './Welcome';
import FinishRegistration from './FinishRegistration';
import * as serviceWorker from './serviceWorker';
import './config/i18next-config';
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import AppURLs from './constants/AppURLs';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import pink from '@material-ui/core/colors/pink';
import Spinner from './component/util/Spinner';

export const history = createBrowserHistory();

const indexRoutes = [{
        path: AppURLs.links.welcome,
        component: Welcome
    }, {
        path: AppURLs.context,
        component: App
    }, {
        path: AppURLs.links.registration,
        component: FinishRegistration
    }];

const theme = createMuiTheme({
    palette: {
        primary: purple,
        secondary: pink
    }
});

ReactDOM.render(
        <Suspense fallback={<Spinner open={true}/>}>
            <ThemeProvider theme={theme}>
                <Router history={history}>
                    <Switch>
                    {indexRoutes.map((prop, key) => {
                        return <Route path={prop.path} component={prop.component} key={key} />;
                    })}
                    </Switch>
                </Router>
            </ThemeProvider>
        </Suspense>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
