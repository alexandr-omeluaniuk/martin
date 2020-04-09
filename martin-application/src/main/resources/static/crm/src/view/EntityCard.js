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
    const [activeTab, setActiveTab] = React.useState(window.location.hash ? parseInt(window.location.hash.replace(/\D/g,'')) : 0);
    const [invalidFields, setInvalidFields] = React.useState(new Map());
    // --------------------------------------------------- FUNCTIONS ----------------------------------------------------------------------
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
        // TODO: on click handlers
        let undeletable = entityData.layout;
        return (
                <Tooltip title={undeletable ? t('common.deactivate') : t('common.delete')}>
                    <IconButton className={classes.dangerButton}>
                        <Icon>{undeletable ? 'block' : 'delete'}</Icon>
                    </IconButton>
                </Tooltip>
        );
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
    let ava = entityData.data.hasAvatar ? (<Avatar src={DataTypeService.getAvatarUrl(entity, entityData.data.id)} />)
            : (<Avatar><Icon>{entityData.listView.icon}</Icon></Avatar>);
    let title = entityData.layout.cardTitle && entityData.data[entityData.layout.cardTitle]
            ? entityData.data[entityData.layout.cardTitle] : '';
    let subHeader = entityData.layout.cardSubTitle && entityData.data[entityData.layout.cardSubTitle]
            ? entityData.data[entityData.layout.cardSubTitle] : '';
    let generalTabIcon = (<Icon>{entityData.listView.icon}</Icon>);
    return (
            <Card>
                <CardHeader avatar={ava} title={title} subheader={subHeader} action={actions()}>
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
    );
}

export default EntityCard;
