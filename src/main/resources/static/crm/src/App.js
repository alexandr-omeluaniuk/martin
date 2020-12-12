import React, {useEffect} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router } from "react-router-dom";
import SecurityService from './service/SecurityService';
import DesktopToolbar from './component/navigation/DesktopToolbar';
import DataService from './service/DataService';
import Notification from './component/window/Notification';
import SideNavBar from './component/navigation/SideNavBar';
import MainContent from './component/navigation/MainContent';
import { ruRU, enUS } from '@material-ui/core/locale';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    }
}));


function App() {
    const classes = useStyles();
    const theme = useTheme();
    const { i18n, t } = useTranslation();
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
    const [notificationDuration, setNotificationDuration] = React.useState(6000);
    // ------------------------------------------------ METHODS ---------------------------------------------------------------------------
    const showNotification = (msg, details, type, duration) => {
        setNotificationMessage(msg);
        setNotificationDetails(details);
        setNotificationType(type ? type : 'info');
        setOpenNotification(true);
        setNotificationDuration(duration ? duration : 6000);
    };
    DataService.setNotification(showNotification);
    // -------------------------------------------------------- HOOKS ---------------------------------------------------------------------
    useEffect(() => {
        if (!navItems) {
            let lang = i18n.language;
            if (lang === 'ru') {
                theme.props = ruRU.props;
            } else if (lang === 'en') {
                theme.props = enUS.props;
            }
            SecurityService.getNavigation(t).then(p => {
                setNavItems(p);
                let currentRoute = p.filter(item => { return window.location.pathname === item.path; });
                setTitle(currentRoute.length > 0 ? currentRoute[0].label : '');
                setIcon(currentRoute.length > 0 ? currentRoute[0].icon : null);
                SecurityService.getPermissions().then(perm => {
                    setPermissions(perm);
                    document.title = 'CRM | ' + perm.subscription.organizationName;
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
                            icon={icon} hasAvatar={permissions ? permissions.hasAvatar : false}
                            userId={permissions ? permissions.userId : null} onMenuItemSelected={(item) => {
                        setTitle(item.label);
                        setIcon(item.icon);
                    }}/>
                    <SideNavBar open={open} setOpen={setOpen} navItems={navItems} onItemSelected={(item) => {
                        setTitle(item.label);
                        setIcon(item.icon);
                        setOpen(false);
                    }}/>
                    <MainContent navItems={navItems} />
                </div>
                <Notification open={openNotification} setOpen={setOpenNotification} message={notificationMessage} 
                        details={notificationDetails} severity={notificationType} duration={notificationDuration}/>
            </Router>
    );
}

export default App;
