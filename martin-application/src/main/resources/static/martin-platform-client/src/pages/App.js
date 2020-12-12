import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { history } from '../index';
import { Router } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import DesktopToolbar from '../component/navigation/DesktopToolbar';
import SideNavBar from '../component/navigation/SideNavBar';
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
    useEffect(() => {
        if (routes === null) {
            setRoutes(SessionService.getAllRoutes());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routes]);
    return (
            <Router history={history}>
                <div className={classes.root}>
                    <CssBaseline />
                    <DesktopToolbar title={title} open={open} setOpen={setOpen} icon={icon}/>
                    <SideNavBar open={open} setOpen={setOpen} onItemSelected={(label, icon) => {
                        setTitle(label);
                        setIcon(icon);
                        setOpen(false);
                        document.title = 'Martin | ' + label;
                    }}/>
                </div>
            </Router>
    );
}

export default App;
