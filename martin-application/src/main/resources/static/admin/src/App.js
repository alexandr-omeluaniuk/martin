import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router } from "react-router-dom";
import SecurityService from './service/SecurityService';
import DesktopToolbar from './component/toolbar/DesktopToolbar';
import DataService from './service/DataService';
import Notification from './component/window/Notification';
import SideNavBar from './component/toolbar/SideNavBar';
import MainContent from './component/toolbar/MainContent';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    }
}));


function App() {
    const classes = useStyles();
    // ------------------------------------------------ STATE -----------------------------------------------------------------------------
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [icon, setIcon] = React.useState(null);
    const [navItems, setNavItems] = React.useState(null);
    const [permissions, setPermissions] = React.useState(null);
    const [openNotification, setOpenNotification] = React.useState(false);
    const [notificationMessage, setNotificationMessage] = React.useState(null);
    const [notificationDetails, setNotificationDetails] = React.useState(null);
    const [notificationType, setNotificationType] = React.useState('info');
    // ------------------------------------------------ METHODS ---------------------------------------------------------------------------
    const showNotification = (msg, details, type) => {
        setNotificationMessage(msg);
        setNotificationDetails(details);
        setNotificationType(type ? type : 'info');
        setOpenNotification(true);
    };
    DataService.setNotification(showNotification);
    // -------------------------------------------------------- HOOKS ---------------------------------------------------------------------
    useEffect(() => {
        if (!navItems) {
            SecurityService.getNavigation().then(p => {
                setNavItems(p);
                let currentRoute = p.filter(item => { return window.location.pathname === item.path; });
                setTitle(currentRoute.length > 0 ? currentRoute[0].label : '');
                setIcon(currentRoute.length > 0 ? currentRoute[0].icon : null);
                SecurityService.getPermissions().then(perm => {
                    setPermissions(perm);
                });
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
    // -------------------------------------------------------- RENDER --------------------------------------------------------------------
    return (
            <Router>
                <div className={classes.root}>
                    <CssBaseline />
                    <DesktopToolbar title={title} open={open} setOpen={setOpen} fullname={permissions ? permissions.fullname : ''}
                            icon={icon}/>
                    <SideNavBar open={open} setOpen={setOpen} navItems={navItems} onItemSelected={(item) => {
                        setTitle(item.label);
                        setIcon(item.icon);
                    }}/>
                    <MainContent navItems={navItems} />
                </div>
                <Notification open={openNotification} setOpen={setOpenNotification} message={notificationMessage} 
                        details={notificationDetails} severity={notificationType}/>
            </Router>
    );
}

export default App;
