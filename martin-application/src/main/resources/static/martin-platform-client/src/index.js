import React, { useEffect, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import { createBrowserHistory } from "history";

import AppURLs from './conf/app-urls';
import Spinner from './component/util/Spinner';
import ErrorBoundary from './component/util/ErrorBoundary';
import Notification from './component/util/Notification';
import { createTheme } from './conf/theme';
import './conf/i18next-config';

import App from './pages/App';
import Welcome from './pages/Welcome';

import { ThemeProvider } from '@material-ui/core/styles';
import 'fontsource-roboto';

export const history = createBrowserHistory();

export var changeTheme;

const indexRoutes = [{
        path: AppURLs.welcome,
        component: Welcome
    }, {
        path: AppURLs.app,
        component: App
    }, {
        path: AppURLs.context,
        component: App
    }];

function Application() {
    const [theme, setTheme] = React.useState(null);
    const [openNotification, setOpenNotification] = React.useState(false);
    const [notificationMessage, setNotificationMessage] = React.useState(null);
    const [notificationDetails, setNotificationDetails] = React.useState(null);
    const [notificationType, setNotificationType] = React.useState('info');
    const [notificationDuration, setNotificationDuration] = React.useState(6000);

    const showNotification = (msg, details, type, duration) => {
        setNotificationMessage(msg);
        setNotificationDetails(details);
        setNotificationType(type ? type : 'info');
        setOpenNotification(true);
        setNotificationDuration(duration ? duration : 6000);
    };
    //DataService.setNotification(showNotification);

    useEffect(() => {
        if (!theme) {
            setTheme(createTheme());
            changeTheme = (newtheme) => {
                setTheme(newtheme);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme]);

    let displayApp = theme ? true : false;
    return (
            <Suspense fallback={ < Spinner open = {true} / > }>
                {displayApp ? (
                    <ThemeProvider theme={theme}>
                        <ErrorBoundary>
                            <Router history={history}>
                                <Switch>
                                    {indexRoutes.map((prop, key) => {
                                        return <Route path={prop.path} component={prop.component} key={key} />;
                                    })}
                                </Switch>
                            </Router>
                        </ErrorBoundary>
                        <Notification open={openNotification} setOpen={setOpenNotification} message={notificationMessage} 
                                details={notificationDetails} severity={notificationType} duration={notificationDuration}/>
                    </ThemeProvider>
                ) : <Spinner open={true}/>}
            </Suspense>
    );
}

ReactDOM.render(<Application/>, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
