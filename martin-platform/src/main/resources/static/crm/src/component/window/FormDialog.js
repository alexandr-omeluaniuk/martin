import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2)
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    },
    saveButton: {
        color: green[500]
    }
}));

function FormDialog(props) {
    const { title, open, handleClose, children } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    return (
            <Dialog open={open} onClose={handleClose} scroll={'paper'} maxWidth={'md'} fullWidth={true}>
                <MuiDialogTitle disableTypography className={classes.root}>
                    <Typography variant="h6">{title}</Typography>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                        <Icon>close</Icon>
                    </IconButton>
                </MuiDialogTitle>
                <DialogContent dividers={true}>
                    {children}
                </DialogContent>
                <DialogActions>
                    <Button className={classes.saveButton}><Icon>done</Icon> {t('components.window.save')}</Button>
                </DialogActions>
            </Dialog>
    );
}

FormDialog.propTypes = {
    title: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default FormDialog;