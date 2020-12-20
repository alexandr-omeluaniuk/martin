/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import Users from './view/Users';
import { Module } from '../../util/model/Module';
import { ModuleView } from '../../util/model/ModuleView';
import { ROLE_SUBSCRIPTION_ADMINISTRATOR } from '../../conf/standard-roles';

export const administrator = new Module('administrator', '/administrator', [
    new ModuleView('users', '/users', 'group', Users)
]).setIcon('admin_panel_settings').permitForRoles([ROLE_SUBSCRIPTION_ADMINISTRATOR]);
