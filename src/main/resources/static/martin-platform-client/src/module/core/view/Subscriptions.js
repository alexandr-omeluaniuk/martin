/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import React from 'react';
import DataTable from '../../../component/datatable/DataTable';
import { useTranslation } from 'react-i18next';
import { TableConfig, TableColumn, FormConfig } from '../../../util/model/TableConfig';

function Subscriptions() {
    const { t } = useTranslation();
    const config = new TableConfig(t('m_core:core.subscriptions'), '/entity/Subscription', [
        new TableColumn('organizationName', t('m_core:organization_name')),
        new TableColumn('started', t('m_core:subscription_start_date')),
        new TableColumn('expirationDate', t('m_core:subscription_expiration_date'))
    ], new FormConfig([]));
    return (
        <DataTable tableConfig={config}/>
    );
}

export default Subscriptions;
