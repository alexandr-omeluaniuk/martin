/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import Subscriptions from './view/Subscriptions';
import { Module } from '../../util/model/Module';
import { ModuleView } from '../../util/model/ModuleView';

export const core = new Module('core', '/core', [
    new ModuleView('subscriptions', '/subscriptions', 'api', Subscriptions)
]).setIcon('security');
