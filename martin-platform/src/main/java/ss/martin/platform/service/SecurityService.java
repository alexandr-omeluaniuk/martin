/*
 * Copyright (C) 2018 Wisent Media
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package ss.martin.platform.service;

import java.util.Set;
import ss.martin.platform.constants.EntityPermission;
import ss.martin.platform.entity.DataModel;
import ss.martin.platform.wrapper.UserPermissions;

/**
 * Security service.
 * @author Alexandr Omeluaniuk
 */
public interface SecurityService {
    /**
     * Get user permissions.
     * @return user permissions.
     * @throws Exception error.
     */
    UserPermissions getUserPermissions() throws Exception;
    /**
     * Get entity permissions.
     * @param clazz data model class.
     * @return set of permissions.
     * @throws Exception error.
     */
    Set<EntityPermission> getEntityPermissions(Class<? extends DataModel> clazz) throws Exception;
}
