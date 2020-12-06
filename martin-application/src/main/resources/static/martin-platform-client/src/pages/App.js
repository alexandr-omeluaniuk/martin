import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { history } from '../index';
import { Router } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import DesktopToolbar from '../component/navigation/DesktopToolbar';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    }
}));

function App() {
    const classes = useStyles();
    const [title, setTitle] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [icon, setIcon] = React.useState(null);
    return (
            <Router history={history}>
                <div className={classes.root}>
                    <CssBaseline />
                    <DesktopToolbar title={title} open={open} setOpen={setOpen} icon={icon}/>
                </div>
            </Router>
    );
}

export default App;
