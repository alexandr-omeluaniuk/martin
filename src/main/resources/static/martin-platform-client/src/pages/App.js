import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { history } from '../index';
import { Router } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import AppToolbar from '../component/navigation/AppToolbar';
import SideNavBar from '../component/navigation/SideNavBar';
import MainContent from '../component/navigation/MainContent';
import SessionService from '../service/SessionService';
import { DESKTOP_MENU_OPEN } from '../conf/local-storage-keys';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    }
}));

function App() {
    const classes = useStyles();
    let isMenuOpen = localStorage.getItem(DESKTOP_MENU_OPEN);
    const [title, setTitle] = React.useState('');
    const [open, setOpen] = React.useState(isMenuOpen === 'true' ? true : false);
    const [icon, setIcon] = React.useState(null);
    const [routes, setRoutes] = React.useState(null);
    const [currentModule, setCurrentModule] = React.useState(null);
    useEffect(() => {
        if (routes === null) {
            setRoutes(SessionService.getAllRoutes());
            history.listen(location => {
                setCurrentModule(SessionService.getCurrentModule());
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routes]);
    return (
            <Router history={history}>
                <div className={classes.root}>
                    <CssBaseline />
                    <AppToolbar title={title} open={open} setOpen={setOpen} icon={icon} currentModule={currentModule}/>
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
