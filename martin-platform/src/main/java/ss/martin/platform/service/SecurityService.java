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
import javax.servlet.http.HttpServletRequest;
import ss.entity.martin.DataModel;
import ss.entity.martin.SystemUser;
import ss.entity.martin.UserAgent;
import ss.martin.platform.constants.EntityPermission;
import ss.martin.platform.spring.security.UserPrincipal;
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
    /**
     * Background authentication for user.
     * @param username username.
     * @param password password.
     */
    void backgroundAuthentication(String username, String password);
    /**
     * Get current user agent.
     * @param httpRequest HTTP request.
     * @return user agent.
     */
    UserAgent getUserAgent(HttpServletRequest httpRequest);
    /**
     * Create principal for user.
     * @param user user.
     * @return principal.
     */
    UserPrincipal createPrincipal(SystemUser user);
}
