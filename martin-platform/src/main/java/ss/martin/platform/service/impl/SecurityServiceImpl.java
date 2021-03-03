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
package ss.martin.platform.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ss.martin.platform.anno.security.EntityAccess;
import ss.martin.platform.constants.EntityPermission;
import ss.martin.platform.entity.DataModel;
import ss.martin.platform.entity.SystemUser;
import ss.martin.platform.security.SecurityContext;
import ss.martin.platform.security.StandardRole;
import ss.martin.platform.service.SecurityService;
import ss.martin.platform.spring.security.UserPrincipal;
import ss.martin.platform.wrapper.UserPermissions;

/**
 * Security service implementation.
 * @author Alexandr Omeluaniuk
 */
@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
class SecurityServiceImpl implements SecurityService {
    /** Logger. */
    private static final Logger LOG = LoggerFactory.getLogger(SecurityService.class);
    /** Security context. */
    @Autowired
    private SecurityContext securityContext;
    /** Authentication manager. */
    @Autowired
    private AuthenticationManager authManager;
    @Override
    public UserPermissions getUserPermissions() throws Exception {
        UserPermissions permissions = new UserPermissions();
        SystemUser currentUser = securityContext.currentUser();
        if (currentUser != null) {
            permissions.setHasAvatar(currentUser.isHasAvatar());
            permissions.setUserId(currentUser.getId());
            permissions.setSubscription(securityContext.subscription());
            permissions.setFullname((currentUser.getFirstname() == null ? "" : currentUser.getFirstname() + " ")
                    + currentUser.getLastname());
            permissions.setStandardRole(currentUser.getStandardRole());
        }
        return permissions;
    }
    @Override
    public Set<EntityPermission> getEntityPermissions(Class<? extends DataModel> clazz) throws Exception {
        Set<EntityPermission> permissions = new HashSet<>();
        // first level of security
        Optional.ofNullable(clazz.getAnnotation(EntityAccess.class)).ifPresentOrElse((anno) -> {
            Set<StandardRole> entityRoles = new HashSet(Arrays.asList(anno.roles()));
            if (entityRoles.contains(securityContext.currentUser().getStandardRole())) {
                permissions.addAll(Arrays.asList(EntityPermission.values()));
            }
        }, () -> {
            permissions.addAll(Arrays.asList(EntityPermission.values()));
        });
        return permissions;
    }
    @Override
    public void backgroundAuthentication(String username, String password) {
        Authentication a = authManager.authenticate(new UserPrincipal(username, password, new ArrayList<>()));
        SecurityContextHolder.getContext().setAuthentication(a);
    }
}
