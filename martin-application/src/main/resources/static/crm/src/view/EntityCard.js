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
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import DataService from '../service/DataService';
import FormField from '../component/form/FormField';
import Grid from '@material-ui/core/Grid';
import DataTypeService, { DataTypes } from '../service/DataTypeService';
import InlineTabHeader from '../component/util/InlineTabHeader';
import { history } from '../index';
import AppURLs from '../constants/AppURLs';
import ListView from './ListView';
import ConfirmDialog from '../component/window/ConfirmDialog';

const useStyles = makeStyles(theme => ({
    tabs: {
        marginBottom: theme.spacing(2)
    },
    captionLabel: {
        color: 'grey',
        marginRight: theme.spacing(2)
    },
    dangerButton: {
        color: theme.palette.error.main
    }
}));

function EntityCard(props) {
    const { entity, id } = props.match.params;
    const { t } = useTranslation();
    const classes = useStyles();
    // --------------------------------------------------- STATE --------------------------------------------------------------------------
    const [update, setUpdate] = React.useState(false);
    const [countMap, setCountMap] = React.useState(new Map());
    const [entityData, setEntityData] = React.useState(null);
    const [dataSnapshot, setDataSnapshot] = React.useState(null);
    const [activeTab, setActiveTab] = React.useState(0);
    const [invalidFields, setInvalidFields] = React.useState(new Map());
    
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [confirmTitle, setConfirmTitle] = React.useState('');
    const [confirmContent, setConfirmContent] = React.useState('');
    const [confirmAcceptAction, setConfirmAcceptAction] = React.useState(null);
    // --------------------------------------------------- FUNCTIONS ----------------------------------------------------------------------
    const onClose = () => {
        setActiveTab(0);
        setEntityData(null);
        history.goBack();
    };
    const onOpenConfirm = (action) => {
        if (action === 'activate') {
            setConfirmTitle(t('components.datatable.toolbar.confirmActivateTitle'));
            setConfirmContent(t('components.datatable.toolbar.confirmActivateContent'));
            setConfirmAcceptAction(action);
            setOpenConfirm(true);
        } else if (action === 'deactivate') {
            setConfirmTitle(t('components.datatable.toolbar.confirmDeactivationTitle'));
            setConfirmContent(t('components.datatable.toolbar.confirmDeactivationContentSingle'));
            setConfirmAcceptAction(action);
            setOpenConfirm(true);
        } else if (action === 'delete') {
            setConfirmTitle(t('components.datatable.toolbar.confirmDeleteTitle'));
            setConfirmContent(t('components.datatable.toolbar.confirmDeleteContentSingle'));
            setConfirmAcceptAction(action);
            setOpenConfirm(true);
        }
    };
    const doActivation = () => {
        DataService.requestPut('/entity/activate/' + entity, [id]).then(resp => {
            setUpdate(!update);
        });
    };
    const doDeactivation = () => {
        DataService.requestPut('/entity/deactivate/' + entity, [id]).then(resp => {
            setUpdate(!update);
        });
    };
    const doDelete = () => {
        DataService.requestPut('/entity/delete/' + entity, [id]).then(resp => {
            history.goBack();
        });
    };
    const onChangeFieldValue = (name, value) => {
        entityData.data[name] = value;
        setEntityData(JSON.parse(JSON.stringify(entityData)));
    };
    const onTabCountUpdate = (data, collection) => {
        let newCountMap = new Map(countMap);
        newCountMap.set(collection.name, data.total);
        setCountMap(newCountMap);
    };
    const onFieldEdit = (field, value) => {
        let validation = DataTypeService.validateField(field, value, t);
        setInvalidFields(validation);
        if (validation.size === 0) {
            let newDataSnapshot = JSON.stringify(entityData.data);
            if (newDataSnapshot !== dataSnapshot) {
                DataService.requestPut('/entity/' + entity, entityData.data).then(resp => {
                    setUpdate(!update);
                    DataService.showNotification(t('notification.changesSaved'), '', 'success', 1000);
                });
            }
        } else {
            setUpdate(!update);
        }
    };
    const auditInfo = () => {
        return (
                <Grid container spacing={2}>
                    <Grid item lg={6} md={6} sm={12}>
                        <Typography variant="caption" display="block" gutterBottom className={classes.captionLabel}>
                            {t('common.created')}
                        </Typography>
                        <Typography variant="caption" display="block" gutterBottom>
                            {(entityData.data.createdBy.firstname ? entityData.data.createdBy.firstname + ' ' : '')}
                            {entityData.data.createdBy.lastname}
                        </Typography>
                        <Typography variant="caption" display="block" gutterBottom>
                            {entityData.data.createdDate}
                        </Typography>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12}>
                        {entityData.data.lastModifiedBy ? (
                            <React.Fragment>
                                <Typography variant="caption" display="block" gutterBottom className={classes.captionLabel}>
                                    {t('common.modified')}
                                </Typography>
                                <Typography variant="caption" display="block" gutterBottom>
                                    {(entityData.data.lastModifiedBy.firstname ? entityData.data.lastModifiedBy.firstname + ' ' : '')}
                                    {entityData.data.lastModifiedBy.lastname}
                                </Typography>
                                <Typography variant="caption" display="block" gutterBottom>
                                    {entityData.data.lastModifiedDate}
                                </Typography>
                            </React.Fragment>
                        ) : null}
                    </Grid>
                </Grid>
        );
    };
    
    const actions = () => {
        let undeletable = entityData.layout.undeletable;
        let buttons = [];
        if (undeletable) {
            if (entityData.data.active) {
                buttons.push(
                    <Tooltip title={t('common.deactivate')} key="2" onClick={() => {onOpenConfirm('deactivate');}}>
                        <IconButton className={classes.dangerButton}>
                            <Icon>block</Icon>
                        </IconButton>
                    </Tooltip>
                );
            } else {
                buttons.push(
                    <Tooltip title={t('common.activate')} key="2" onClick={() => {onOpenConfirm('activate');}}>
                        <IconButton>
                            <Icon>restore</Icon>
                        </IconButton>
                    </Tooltip>
                );
            }
        } else {
            buttons.push(
                <Tooltip title={t('common.delete')} key="2" onClick={() => {onOpenConfirm('delete');}}>
                    <IconButton className={classes.dangerButton}>
                        <Icon>delete</Icon>
                    </IconButton>
                </Tooltip>
            );
        }
        if (history.length > 0) {
            buttons.push(
                <Tooltip title={t('common.close')} key="1" onClick={onClose}>
                    <IconButton>
                        <Icon>close</Icon>
                    </IconButton>
                </Tooltip>
            );
        }
        return buttons;
    };
    
    const tabContent = (entityCollections) => {
        return (
                <React.Fragment>
                    <Grid container spacing={2} style={{display: activeTab === 0 ? '' : 'none'}}>
                        {entityData.layout.fields.filter(f => { return f.dataType !== DataTypes.AVATAR; }).map((field, idx) => {
                            if (!field.grid) {
                                return null;
                            }
                            return (
                                    <FormField field={field} key={idx} onChangeFieldValue={onChangeFieldValue} onFieldEdit={onFieldEdit}
                                        invalidFields={invalidFields} entity={entity} 
                                        fieldValue={DataTypeService.convertServerValueToUIFormat(field, entityData.data, entity)}/>
                            );
                        })}
                    </Grid>
                    {entityData.layout.audit && activeTab === 0 ? auditInfo() : null}
                    {entityCollections.map((collection, idx) => {
                        let collectionTabContent = null;
                        if (collection.attributes.REPRESENTATION_TYPE === 'LIST_VIEW') {
                            collectionTabContent = (
                                    <ListView metadata={collection.attributes.COLLECTION_TYPE_METADATA} filter={{
                                        predicates: [{
                                                field: collection.attributes.MAPPED_BY + '.id',
                                                value: id,
                                                operator: 'EQUALS'
                                        }],
                                        operator: 'AND'
                                    }} onLoadCallback={(data) => onTabCountUpdate(data, collection)}/>
                            );
                        }
                        return (<div key={idx} style={{display: activeTab - 1 === idx ? '' : 'none'}}>
                                    {collectionTabContent}
                                </div>);
                    })}
                </React.Fragment>
                
        );
    };
    // --------------------------------------------------- USE EFFECT ---------------------------------------------------------------------
    useEffect(() => {
        DataService.requestGet('/entity/' + entity + '/' + id).then(resp => {
            setEntityData(resp);
            setDataSnapshot(JSON.stringify(resp.data));
            setActiveTab(window.location.hash ? parseInt(window.location.hash.replace(/\D/g,'')) : 0);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entity, id, update]);
    useEffect(() => {
        return () => {
            DataService.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // ---------------------------------------------------- RENDERING ---------------------------------------------------------------------
    if (!entityData) {
        return null;
    }
    let entityCollections = entityData.layout.fields.filter(f => {
        return f.dataType === DataTypes.ENTITY_COLLECTION;
    });
    if (activeTab > entityCollections.length) {
        return null;
    }
    let ava = entityData.data.hasAvatar ? (<Avatar src={DataTypeService.getAvatarUrl(entity, entityData.data.id)} />)
            : (<Avatar><Icon>{entityData.listView.icon}</Icon></Avatar>);
    let title = entityData.layout.cardTitle && entityData.data[entityData.layout.cardTitle]
            ? entityData.data[entityData.layout.cardTitle] : '';
    let subHeader = entityData.layout.cardSubTitle && entityData.data[entityData.layout.cardSubTitle]
            ? entityData.data[entityData.layout.cardSubTitle] : '';
    let generalTabIcon = (<Icon>{entityData.listView.icon}</Icon>);
    let isDeactivated = entityData.layout.undeletable && !entityData.data.active;
    let confirmAcceptFunction = null;
    if (confirmAcceptAction === 'activate') {
        confirmAcceptFunction = doActivation;
    } else if (confirmAcceptAction === 'deactivate') {
        confirmAcceptFunction = doDeactivation;
    } else if (confirmAcceptAction === 'delete') {
        confirmAcceptFunction = doDelete;
    }
    return (
            <React.Fragment>
                <Card>
                    <CardHeader avatar={ava} subheader={subHeader} action={actions()} title={
                        (<Typography style={{textDecoration: isDeactivated ? 'line-through' : ''}}>{title}</Typography>)
                    }>
                    </CardHeader>
                    <CardContent>
                        <Tabs indicatorColor="secondary" textColor="secondary" value={activeTab} onChange={(e, index) => {
                            setActiveTab(index);
                            history.push(AppURLs.links.entity + '/' + entity + '/' + id + '#' + index);
                        }} className={classes.tabs} >
                            <Tab label={(
                                    <InlineTabHeader icon={generalTabIcon} title={t('model.' + entity + '.label.single')}/>
                            )}></Tab>
                            {entityCollections.map((tab, idx) => {
                                return (
                                        <Tab key={idx} label={(
                                            <InlineTabHeader icon={tab.attributes.COLLECTION_TYPE_METADATA.icon}
                                                title={t('model.' + tab.attributes.COLLECTION_TYPE_METADATA.className + '.label.many')
                                                    + ' (' + (countMap.has(tab.name) ? countMap.get(tab.name) : 0) + ')'}/>
                                        )}></Tab>
                                );
                            })}
                        </Tabs>
                        {tabContent(entityCollections)}
                    </CardContent>
                </Card>
                <ConfirmDialog open={openConfirm} handleClose={() => setOpenConfirm(false)} title={confirmTitle}
                            contentText={confirmContent} declineBtnOnClick={() => setOpenConfirm(false)}
                            acceptBtnOnClick={confirmAcceptFunction}
                            acceptBtnLabel={t('common.confirm')} declineBtnLabel={t('common.cancel')}/>
            </React.Fragment>
    );
}

export default EntityCard;
