/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ColorPicker from './ColorPicker';
import { createTheme, getPrimaryColor, getSecondaryColor, getPrimaryColorContrast, getSecondaryColorContrast,
    savePrimaryColorContrast, saveSecondaryColorContrast, savePrimaryColor, saveSecondaryColor } from '../../config/colors';
import { changeTheme } from '../../index';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2)
    },
    title: {
        marginBottom: theme.spacing(1)
    }
}));

function Theming(props) {
    const classes = useStyles();
    const { t } = useTranslation();
    // -------------------------------------------------- STATE ---------------------------------------------------------------------------
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [type, setType] = React.useState('');
    const [color, setColor] = React.useState(null);
    const [contrast, setContrast] = React.useState(null);
    // -------------------------------------------------- FUNCTIONS -----------------------------------------------------------------------
    const openColorPicker = (type) => {
        let title, color, contrast;
        if ('PRIMARY' === type) {
            title = t('components.theming.primary');
            color = getPrimaryColor();
            contrast = getPrimaryColorContrast();
        } else {
            title = t('components.theming.secondary');
            color = getSecondaryColor();
            contrast = getSecondaryColorContrast();
        }
        setTitle(title);
        setOpen(true);
        setType(type);
        setContrast(contrast);
        setColor(color);
    };
    const closeColorPicker = () => {
        setOpen(false);
    };
    const contrastChanged = (event, contrast) => {
        if (type === 'PRIMARY') {
            savePrimaryColorContrast(contrast);
        } else if (type === 'SECONDARY') {
            saveSecondaryColorContrast(contrast);
        }
        setContrast(contrast);
        changeTheme(createTheme());
    };
    const colorChanged = (color) => {
        if (type === 'PRIMARY') {
            savePrimaryColor(color);
        } else if (type === 'SECONDARY') {
            saveSecondaryColor(color);
        }
        setColor(color);
        changeTheme(createTheme());
    };
    // -------------------------------------------------------- RENDER --------------------------------------------------------------------
    return (
            <Paper elevation={0} className={classes.root}>
                <Typography align="center" className={classes.title}>{ t('components.theming.title') }</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button fullWidth variant="contained" color="primary" onClick={() => openColorPicker('PRIMARY')}>
                            { t('components.theming.primary') }
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button fullWidth variant="contained" color="secondary" onClick={() => openColorPicker('SECONDARY')}>
                            { t('components.theming.secondary') }
                        </Button>
                    </Grid>
                </Grid>
                <ColorPicker open={open} title={title} onClose={closeColorPicker} color={color}
                    contrast={contrast} contrastChanged={contrastChanged} colorChanged={colorChanged}/>
            </Paper>
    );
};

export default Theming;
