/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dropdown from './Dropdown';
import { useTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Form from '../Form';
import FormDialog from '../../window/FormDialog';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex'
    },
    dropdownContainer: {
        flex: 1
    },
    buttonContainer: {
        display: 'flex',
        alignItems: 'flex-end'
    },
    button: {
        padding: theme.spacing(1)
    },
    addButtonIcon: {
        color: theme.palette.primary.main
    },
    deleteButtonIcon: {
        color: theme.palette.error.main
    }
}));

function NewOptionDropdown (props) {
    const { formConfig, onNewOptionSubmit, onNewOptionDelete, ...other } = props;
    const { value } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    return (
            <React.Fragment>
                <div className={classes.container}>
                    <div className={classes.dropdownContainer}>
                        <Dropdown {...other}/>
                    </div>
                    <div className={classes.buttonContainer}>
                        <Tooltip title={t('common.newRecord')}>
                            <IconButton className={classes.button} onClick={() => setOpen(true)}>
                                <Icon fontSize="small" className={classes.addButtonIcon}>add</Icon>
                            </IconButton>
                        </Tooltip>
                        {value && onNewOptionDelete? 
                        <Tooltip title={t('common.delete')}>
                            <IconButton className={classes.button} onClick={() => onNewOptionDelete(value)}>
                                <Icon fontSize="small" className={classes.deleteButtonIcon}>delete</Icon>
                            </IconButton>
                        </Tooltip>
                        : null}
                    </div>
                </div>
                <FormDialog open={open} maxWidth="sm"
                        handleClose={() => setOpen(false)} title={t('common.newRecord')}>
                    <Form formConfig={formConfig} onSubmitAction={(formData) => {
                        setOpen(false);
                        onNewOptionSubmit(formData);
                    }}/>              
                </FormDialog>
            </React.Fragment>
    );
}

export default NewOptionDropdown;
