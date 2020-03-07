import React, { Suspense, useEffect } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Welcome from './Welcome';
import FinishRegistration from './FinishRegistration';
import * as serviceWorker from './serviceWorker';
import './config/i18next-config';
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import AppURLs from './constants/AppURLs';
import { ThemeProvider } from '@material-ui/core/styles';
import Spinner from './component/util/Spinner';
import { createTheme } from './config/colors';

export const history = createBrowserHistory();

export var changeTheme;

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


function Application() {
    const [theme, setTheme] = React.useState(null);
    useEffect(() => {
        if (!theme) {
            setTheme(createTheme());
            changeTheme = (newtheme) => {
                setTheme(newtheme);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme]);
    if (!theme) {
        return null;
    }
    return (
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
            </Suspense>
    );
}

ReactDOM.render(<Application/>, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
