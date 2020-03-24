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
package ss.martin.platform.service.test;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import ss.martin.platform.constants.EntityPermission;
import ss.martin.platform.entity.Subscription;
import ss.martin.platform.entity.SystemUser;
import ss.martin.platform.exception.PlatformSecurityException;
import ss.martin.platform.security.StandardRole;
import ss.martin.platform.service.EntityService;
import ss.martin.platform.test.AbstractTest;
import ss.martin.platform.test.data.Contact;

/**
 *
 * @author ss
 */
public class EntityServiceTest extends AbstractTest {
    
    @Autowired
    private EntityService entityService;
    
    @DisplayName("Create entity")
    @Test
    public void testCreateEntity() throws Exception {
        auth(StandardRole.ROLE_SUBSCRIPTION_USER);
        Contact entity = new Contact();
        entity.setLastname("Dowson");
        entityService.createEntity(entity);
        try {
            Subscription subscription = dataFactory.getSubscription();
            entityService.createEntity(subscription);
            Assertions.fail("Security exception expected");
        } catch (PlatformSecurityException ex) {
            Assertions.assertEquals(EntityPermission.CREATE, ex.getEntityPermission());
        }
        try {
            SystemUser systemUser = dataFactory.getSystemUser(StandardRole.ROLE_SUPER_ADMIN,
                    "newuser@domain.com", "password", "Michael", "Jackson");
            entityService.createEntity(systemUser);
            Assertions.fail("Security exception expected");
        } catch (PlatformSecurityException ex) {
            Assertions.assertEquals(EntityPermission.CREATE, ex.getEntityPermission());
        }
    }
}
