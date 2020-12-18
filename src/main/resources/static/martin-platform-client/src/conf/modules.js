/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import { common } from '../module/common/module';
import { core } from '../module/core/module';
import { SharedDataService } from '../service/SharedDataService';
import { ROLE_SUPER_ADMIN } from '../conf/standard-roles';

/**
 * Modules metadata.
 * 'id' values must be unique inside module.
 * @type Array
 */
export const modules = function () {
    const modules = [common, core];
    const permissions = SharedDataService.permissions;
    return modules.filter(m => {
        if (m.getId() === 'core' && permissions.standardRole !== ROLE_SUPER_ADMIN) {
            return false;
        }
        return true;
    });
};