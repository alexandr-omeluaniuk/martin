/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import React from 'react';
import DataTable from '../../../component/datatable/DataTable';

function Subscriptions() {
    
    const tableConfig = {
        apiUrl: '/entity/ss.martin.platform.entity.Subscription',
        columns: [{
            
        }],
        formConfig: {
            formFields: []
        }
    };
    return (
        <DataTable tableConfig={tableConfig}/>
    );
}

export default Subscriptions;
