/* 
 * The MIT License
 *
 * Copyright 2020 ss.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import DataService from '../../service/DataService';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import "moment/locale/ru";
import { green } from '@material-ui/core/colors';
import DataTypeService, { TYPE_STRING, TYPE_DATE } from '../../service/DataTypeService';
import FormField from './FormField';

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

function StandardForm(props) {
    const classes = useStyles();
    const { t } = useTranslation();
    const { entity, open, handleClose, afterSaveCallback, id } = props;
    // ------------------------------------------ STATE -----------------------------------------------------------------------------------
    const [layout, setLayout] = React.useState(null);
    const [formData, setFormData] = React.useState(new Map());
    const [invalidFields, setInvalidFields] = React.useState(new Map());
    // ------------------------------------------ FUNCTIONS -------------------------------------------------------------------------------
    const onChangeFieldValue = (name, value) => {
        let field = layout.fields.filter(f => {return f.name === name;})[0];
        formData.set(name, DataTypeService.convertUIValue(field, value, formData.get(name)));
        setFormData(new Map(formData));
        setInvalidFields(isFormValid());
    };
    const isFormValid = () => {
        let newInvalidField = new Map();
        layout.fields.filter(f => {return !f.hidden;}).forEach(field => {
            let fieldName = field.name;
            let value = formData.has(fieldName) ? formData.get(fieldName) : null;
            newInvalidField = new Map([...newInvalidField, ...DataTypeService.validateField(field, value, t)]);
        });
        return newInvalidField;
    };
    const saveChanges = () => {
        let validationResult = isFormValid();
        if (validationResult.size === 0) {
            let data = {};
            for (const [key, value] of formData.entries()) {
                let field = layout.fields.filter(f => { return f.name === key; })[0];
                data[key] = DataTypeService.convertUIValueToServerFormat(field, value);
            }
            handleClose();
            if (formData.has('id')) {
                DataService.requestPut('/entity/' + entity, data).then(resp => {
                    if (afterSaveCallback) {
                        afterSaveCallback();
                    }
                });
            } else {
                DataService.requestPost('/entity/' + entity, data).then(resp => {
                    if (afterSaveCallback) {
                        afterSaveCallback();
                    }
                });
            }
        } else {
            setInvalidFields(validationResult);
        }
    };
    const load = (layout, data) => {
        if (data) {
            let dataMap = new Map();
            layout.fields.forEach(field => {
                if (data[field.name] !== undefined) {
                    let value = data[field.name];
                    if (field.fieldType === TYPE_DATE) {
                        value = moment(value, t('constants.momentJsDateFormat'));
                    } else if (field.fieldType === TYPE_STRING) {
                        value = value === null || value === undefined ? '' : value;
                    }
                    dataMap.set(field.name, value);
                }
            });
            setFormData(dataMap);
        }
        setLayout(layout);
    };
    // ------------------------------------------ HOOKS -----------------------------------------------------------------------------------
    useEffect(() => {
        if (open) {
            setInvalidFields(new Map());
            setFormData(new Map());
            DataService.requestGet('/entity/' + entity + '/' + (id ? id : 0)).then(resp => {
                load(resp.layout, resp.data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);
    // ------------------------------------------ RENDERING -------------------------------------------------------------------------------
    if (layout === null) {
        return null;
    }
    return (
            <Dialog open={open} onClose={handleClose} scroll={'paper'} maxWidth={'md'} fullWidth={true}>
                <MuiDialogTitle disableTypography className={classes.root}>
                    <Typography variant="h6">{t('models.titles.' + entity)}</Typography>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                        <Icon>close</Icon>
                    </IconButton>
                </MuiDialogTitle>
                <DialogContent dividers={true}>
                    <Grid container spacing={2}>
                        {layout.fields.map((field, idx) => {
                            if (field.hidden || !field.grid) {
                                return null;
                            }
                            return (
                                    <FormField field={field} key={idx} onChangeFieldValue={onChangeFieldValue}
                                        invalidFields={invalidFields} entity={entity} fieldValue={formData.get(field.name)}/>
                            );
                        })}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button className={classes.saveButton} onClick={saveChanges}><Icon>done</Icon> {t('components.window.save')}</Button>
                </DialogActions>
            </Dialog>
    );
}

StandardForm.propTypes = {
    entity: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    afterSaveCallback: PropTypes.func,
    id: PropTypes.number
};

export default StandardForm;