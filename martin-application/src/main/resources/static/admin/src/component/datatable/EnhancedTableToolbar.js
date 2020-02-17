/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1)
        },
        highlight: theme.palette.type === 'light' ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        } : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
        },
        title: {
            flex: '1 1 100%'
        },
        greenButton: {
            color: green[500]
        }
    }));

function EnhancedTableToolbar(props) {
    const classes = useStyles();
    const { t } = useTranslation();
    const { numSelected, title, clearSelection, massDeletion, createEntry } = props;
    return (
            <Toolbar className={clsx(classes.root, { [classes.highlight]: numSelected > 0 })}>
                {numSelected > 0 ? (
                    <Typography className={classes.title} color="inherit" variant="subtitle1">
                        {t('components.datatable.selectedRecords')}: {numSelected}
                    </Typography>
                ) : (
                    <Typography className={classes.title} variant="h6" id="tableTitle">
                        {title ? title : ''}
                    </Typography>
                )}
                {numSelected > 0 ? (
                    <React.Fragment>
                        <Tooltip title={t('common.delete')}>
                            <IconButton aria-label="delete" onClick={massDeletion}>
                                <Icon>delete</Icon>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('components.datatable.clearSelection')}>
                            <IconButton aria-label="clear selection" onClick={clearSelection}>
                                <Icon>close</Icon>
                            </IconButton>
                        </Tooltip>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Tooltip title={t('components.datatable.toolbar.add')}>
                            <IconButton aria-label="add record" className={classes.greenButton} onClick={createEntry}>
                                <Icon>add</Icon>
                            </IconButton>
                        </Tooltip>
                    </React.Fragment>
                )}
            </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    title: PropTypes.string,
    clearSelection: PropTypes.func.isRequired,
    massDeletion: PropTypes.func.isRequired,
    createEntry: PropTypes.func.isRequired
};

export default EnhancedTableToolbar;
