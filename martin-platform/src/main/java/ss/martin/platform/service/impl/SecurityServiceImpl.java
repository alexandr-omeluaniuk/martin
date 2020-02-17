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

import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import ss.martin.platform.anno.ui.SideBarNavigationItem;
import ss.martin.platform.constants.RepresentationComponentType;
import ss.martin.platform.entity.DataModel;
import ss.martin.platform.entity.Subscription;
import ss.martin.platform.entity.SystemUser;
import ss.martin.platform.security.ApplicationModuleProvider;
import ss.martin.platform.security.StandardRole;
import ss.martin.platform.service.EntityMetadataService;
import ss.martin.platform.service.SecurityService;
import ss.martin.platform.security.SecurityContext;
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
    /** Data model classes. */
    private static final Set<Class<? extends DataModel>> DATA_MODEL_CLASSES = new HashSet<>();
    /** Security context. */
    @Autowired
    private SecurityContext securityContext;
    /** Entity metadata service. */
    @Autowired
    private EntityMetadataService entityMetadataService;
    /** Modules. */
    @Autowired
    private List<ApplicationModuleProvider> modules;
    /**
     * Static initialization.
     */
    static {
        DATA_MODEL_CLASSES.add(SystemUser.class);
        DATA_MODEL_CLASSES.add(Subscription.class);
    }
    @Override
    public UserPermissions getUserPermissions() throws Exception {
        SystemUser currentUser = securityContext.currentUser();
        UserPermissions permissions = new UserPermissions();
        permissions.setFullname((currentUser.getFirstname() == null ? "" : currentUser.getFirstname() + " ")
                + currentUser.getLastname());
        permissions.setSideBarNavItems(new ArrayList<>());
        // side bar navigation (application modules)
        Subscription subscription = securityContext.subscription();
        modules.stream().filter((m) -> {
            return subscription.getModules().contains(m.module());
        }).forEach((provider) -> {
            permissions.getSideBarNavItems().add(provider.representationComponent());
        });
        // side bar navigation (static)
        for (Class<? extends DataModel> dataModelClass : DATA_MODEL_CLASSES) {
            if (!Modifier.isAbstract(dataModelClass.getModifiers())) {
                Optional.ofNullable(dataModelClass.getAnnotation(SideBarNavigationItem.class))
                        .ifPresent(sideBarNavItem -> {
                    Set<StandardRole> accessibleForRoles = new HashSet<>(Arrays.asList(sideBarNavItem.roles()));
                    if (accessibleForRoles.contains(currentUser.getStandardRole())) {
                        try {
                            if (sideBarNavItem.component() == RepresentationComponentType.LIST_VIEW) {
                                permissions.getSideBarNavItems()
                                        .add(entityMetadataService.getEntityListView(dataModelClass));
                            }
                        } catch (Exception e) {
                            LOG.warn("impossible to create a side nav bar item!", e);
                        }
                    }
                });
            }
        }
        return permissions;
    }
}
