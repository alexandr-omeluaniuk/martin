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
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DataService from '../service/DataService';
import { TYPE_AVATAR } from '../config/datatypes';
import FormField from '../component/form/FormField';
import Grid from '@material-ui/core/Grid';
import { convertUIValue } from '../config/datatypes';

const useStyles = makeStyles(theme => ({
    tabs: {
        marginBottom: theme.spacing(2)
    }
}));

function EntityCard(props) {
    const { entity, id } = props.match.params;
    const { t } = useTranslation();
    const classes = useStyles();
    // --------------------------------------------------- STATE --------------------------------------------------------------------------
    const [entityData, setEntityData] = React.useState(null);
    const [activeTab, setActiveTab] = React.useState(0);
    const [invalidFields, setInvalidFields] = React.useState(new Map());
    // --------------------------------------------------- FUNCTIONS ----------------------------------------------------------------------
    const onChangeFieldValue = (name, value) => {
        entityData.data[name] = value;
        setEntityData(JSON.parse(JSON.stringify(entityData)));
    };
    const onFieldEdit = () => {
        
    };
    // --------------------------------------------------- USE EFFECT ---------------------------------------------------------------------
    useEffect(() => {
        DataService.requestGet('/entity/' + entity + '/' + id).then(resp => {
            setEntityData(resp);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entity, id]);
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
    let avaField = entityData.layout.fields.filter(f => { return f.fieldType === TYPE_AVATAR; });
    let ava = avaField.length > 0 && entityData.data[avaField[0].name] ? (<Avatar src={entityData.data[avaField[0].name]} />)
            : (<Avatar><Icon>{entityData.listView.icon}</Icon></Avatar>);
    let title = entityData.layout.cardTitle && entityData.data[entityData.layout.cardTitle]
            ? entityData.data[entityData.layout.cardTitle] : '';
    let subHeader = entityData.layout.cardSubTitle && entityData.data[entityData.layout.cardSubTitle]
            ? entityData.data[entityData.layout.cardSubTitle] : '';
    let generalTabIcon = (<Icon>{entityData.listView.icon}</Icon>);
    return (
            <Card>
                <CardHeader avatar={ava} title={title} subheader={subHeader}>
            
                </CardHeader>
                <CardContent>
                    <Tabs indicatorColor="secondary" textColor="secondary" value={activeTab} onChange={(e, index) => {
                        setActiveTab(index);
                    }} className={classes.tabs} >
                        <Tab icon={generalTabIcon} label={t('models.titles.' + entity)}></Tab>
                    </Tabs>
                    <Grid container spacing={2}>
                        {entityData.layout.fields.filter(f => { return f.fieldType !== TYPE_AVATAR; }).map((field, idx) => {
                            if (field.hidden || !field.grid) {
                                return null;
                            }
                            return (
                                    <FormField field={field} key={idx} onChangeFieldValue={onChangeFieldValue} onFieldEdit={onFieldEdit}
                                        invalidFields={invalidFields} entity={entity} fieldValue={entityData.data[field.name]}/>
                            );
                        })}
                    </Grid>
                </CardContent>
            </Card>
    );
}

export default EntityCard;
