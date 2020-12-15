/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import Applications from './view/Applications';
import { Module } from '../../util/model/Module';
import { ModuleView } from '../../util/model/ModuleView';

export const common = new Module('common', '/common', [
    new ModuleView('applications', '/applications', 'widgets', Applications)
]).setInvisible();

