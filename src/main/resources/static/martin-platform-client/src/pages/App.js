import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { history } from '../index';
import { Router } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import AppToolbar from '../component/navigation/AppToolbar';
import SideNavBar from '../component/navigation/SideNavBar';
import MainContent from '../component/navigation/MainContent';
import SessionService from '../service/SessionService';
import DataService from '../service/DataService';
import { DESKTOP_MENU_OPEN } from '../conf/local-storage-keys';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    }
}));

const dataService = new DataService();

function App() {
    const classes = useStyles();
    let isMenuOpen = localStorage.getItem(DESKTOP_MENU_OPEN);
    const [title, setTitle] = React.useState('');
    const [open, setOpen] = React.useState(isMenuOpen === 'true' ? true : false);
    const [icon, setIcon] = React.useState(null);
    const [routes, setRoutes] = React.useState(null);
    const [currentModule, setCurrentModule] = React.useState(null);
    const [permissions, setPermissions] = React.useState(null);
    // --------------------------------------------------------- HOOKS --------------------------------------------------------------------
    useEffect(() => {
        if (routes === null) {
            setRoutes(SessionService.getAllRoutes());
            history.listen(location => {
                setCurrentModule(SessionService.getCurrentModule());
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routes]);
    useEffect(() => {
        if (permissions === null) {
            dataService.get(`/security/permissions`).then(permissions => {
                setPermissions(permissions);
            });
        }
        return () => {
            dataService.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [permissions]);
    // ------------------------------------------------------------ RENDERING -------------------------------------------------------------
    if (!permissions) {
        return null;
    }
    return (
            <Router history={history}>
                <div className={classes.root}>
                    <CssBaseline />
                    <AppToolbar title={title} open={open} setOpen={setOpen} icon={icon} currentModule={currentModule}
                        permissions={permissions}/>
                    <SideNavBar open={open} currentModule={currentModule} setOpen={setOpen} onItemSelected={(label, icon) => {
                        setTitle(label);
                        setIcon(icon);
                        //setOpen(false);
                        document.title = 'Martin | ' + label;
                    }}/>
                    {routes ? <MainContent routes={routes} open={open} currentModule={currentModule}/> : null}
                </div>
            </Router>
    );
}

export default App;
