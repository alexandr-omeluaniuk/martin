/*
 * The MIT License
 *
 * Copyright 2020 ss.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
package ss.martin.platform.entity.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;
import ss.martin.platform.entity.SystemUser;
import ss.martin.platform.entity.TenantEntity;
import ss.martin.platform.security.SecurityContext;
import ss.martin.platform.security.StandardRole;
import ss.martin.platform.service.ReflectionUtils;

/**
 * Tenant entity listener.
 * @author ss
 */
public class TenantEntityListener {
    @Autowired
    private ReflectionUtils reflectionUtils;
    @Autowired
    private SecurityContext securityContext;
    @PrePersist
    @PreUpdate
    protected void prePersistAndUpdate(TenantEntity entity) throws Exception {
        if (entity instanceof SystemUser
                && StandardRole.ROLE_SUPER_ADMIN.equals(((SystemUser) entity).getStandardRole())) {
            return;
        }
        SpringBeanAutowiringSupport.processInjectionBasedOnCurrentContext(this);
        if (reflectionUtils.hasSuperClass(entity.getClass(), TenantEntity.class)) {
            TenantEntity tenantEntity = (TenantEntity) entity;
            tenantEntity.setSubscription(securityContext.currentUser().getSubscription());
        }
    }
}