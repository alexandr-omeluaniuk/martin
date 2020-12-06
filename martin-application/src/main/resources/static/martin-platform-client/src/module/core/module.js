/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import Subscriptions from './view/Subscriptions';
import Users from './view/Users';

export const core = () => {
    return {
        id: 'CORE',
        path: '/core',
        items: [{
                id: 'dashboardView',
                path: '/subscriptions',
                icon: 'dashboard',
                component: Subscriptions
            }, {
                id: 'dashboardView',
                path: '/users',
                icon: 'dashboard',
                component: Users
            }]
    };
};
