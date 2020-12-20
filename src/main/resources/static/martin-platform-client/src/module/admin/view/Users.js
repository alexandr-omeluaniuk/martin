/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import React from 'react';
import DataTable from '../../../component/datatable/DataTable';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { TableConfig, TableColumn, FormConfig, FormField, Validator, ALIGN_RIGHT } from '../../../util/model/TableConfig';
import Icon from '@material-ui/core/Icon';
import { TYPES, VALIDATORS } from '../../../service/DataTypeService';

const useStyles = makeStyles(theme => ({
    active: {
        color: theme.palette.success.main
    },
    inactive: {
        color: theme.palette.grey.main
    }
}));

function Users() {
    const classes = useStyles();
    const { t } = useTranslation();
    const config = new TableConfig(t('m_administrator:administrator.users'), '/entity/SystemUser', [
        new TableColumn('fullname', t('m_administrator:users.fullname'), (row) => {
            return `${row.firstname ? `${row.firstname} ` : ''}${row.lastname}`;
        }).setSortable().width('300px'),
        new TableColumn('email', t('m_administrator:users.email')).setSortable(),
        new TableColumn('status', t('m_administrator:users.status')).setSortable().width('150px'),
        new TableColumn('active', t('m_core:subscription_active'), (row) => {
            return <Icon className={row.active ? classes.active : classes.inactive}>check_circle</Icon>;
        }).width('40px').alignment(ALIGN_RIGHT)
    ], new FormConfig());
    return (
        <DataTable tableConfig={config}/>
    );
}

export default Users;
