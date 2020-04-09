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

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import ss.martin.platform.constants.EntityPermission;
import ss.martin.platform.entity.EntityFile;
import ss.martin.platform.entity.Subscription;
import ss.martin.platform.entity.SystemUser;
import ss.martin.platform.exception.PlatformException;
import ss.martin.platform.exception.PlatformSecurityException;
import ss.martin.platform.security.SecurityContext;
import ss.martin.platform.security.StandardRole;
import ss.martin.platform.service.EntityService;
import ss.martin.platform.test.AbstractTest;
import ss.martin.platform.test.data.Contact;
import ss.martin.platform.test.data.ContactAdmin;
import ss.martin.platform.wrapper.EntitySearchRequest;
import ss.martin.platform.wrapper.EntitySearchResponse;

/**
 *
 * @author ss
 */
public class EntityServiceTest extends AbstractTest {
    
    @Autowired
    private EntityService entityService;
    
    @Autowired
    private SecurityContext securityContext;
    
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
    
    @DisplayName("Update entity")
    @Test
    public void testUpdateEntity() throws Exception {
        auth(StandardRole.ROLE_SUBSCRIPTION_USER);
        Contact entity = new Contact();
        entity.setLastname("Dowson");
        entityService.createEntity(entity);
        entity.setLastname("Mikky");
        entity = entityService.updateEntity(entity);
        Assertions.assertEquals("Mikky", entity.getLastname());
        try {
            entityService.updateEntity(securityContext.subscription());
            Assertions.fail("Security exception expected");
        } catch (PlatformSecurityException ex) {
            Assertions.assertEquals(EntityPermission.UPDATE, ex.getEntityPermission());
        }
    }
    
    @DisplayName("Find by ID")
    @Test
    public void testFindEntityByID() throws Exception {
        auth(StandardRole.ROLE_SUBSCRIPTION_USER);
        Contact entity = new Contact();
        entity.setLastname("Dowson");
        entity = entityService.createEntity(entity);
        Assertions.assertNotNull(entity.getId());
        Contact contact2 = entityService.findEntityByID(entity.getId(), Contact.class);
        Assertions.assertEquals("Dowson", contact2.getLastname());
        try {
            entityService.findEntityByID(securityContext.subscription().getId(), Subscription.class);
            Assertions.fail("Security exception expected");
        } catch (PlatformSecurityException ex) {
            Assertions.assertEquals(EntityPermission.READ, ex.getEntityPermission());
        }
    }
    
    @DisplayName("Get entity avatar")
    @Test
    public void testGetEntityAvatar() throws Exception {
        auth(StandardRole.ROLE_SUBSCRIPTION_ADMINISTRATOR);
        ContactAdmin entity = new ContactAdmin();
        entity.setLastname("Dowson");
        entityService.createEntity(entity);
        EntityFile ava = dataFactory.getAvatar(entity);
        entity.setAvatar(ava);
        entityService.updateEntity(entity);
        EntityFile avatar = entityService.getEntityAvatar(entity.getId(), entity.getClass());
        Assertions.assertNotNull(avatar);
        auth(StandardRole.ROLE_SUBSCRIPTION_USER);
        try {
            entityService.getEntityAvatar(entity.getId(), entity.getClass());
            Assertions.fail("Security exception expected");
        } catch (PlatformSecurityException ex) {
            Assertions.assertEquals(EntityPermission.READ, ex.getEntityPermission());
        }
    }
    
    @DisplayName("Mass delete entities")
    @Test
    public void testMassDeleteEntities() throws Exception {
        auth(StandardRole.ROLE_SUBSCRIPTION_ADMINISTRATOR);
        ContactAdmin entity = new ContactAdmin();
        entity.setLastname("Dowson");
        entityService.createEntity(entity);
        Set<Long> ids = new HashSet<>();
        ids.add(entity.getId());
        auth(StandardRole.ROLE_SUBSCRIPTION_USER);
        try {
            entityService.deleteEntities(ids, ContactAdmin.class);
            Assertions.fail("Security exception expected");
        } catch (PlatformSecurityException ex) {
            Assertions.assertEquals(EntityPermission.DELETE, ex.getEntityPermission());
        }
        auth(StandardRole.ROLE_SUBSCRIPTION_ADMINISTRATOR);
        entityService.deleteEntities(ids, ContactAdmin.class);
        // try to delete undeletable
        auth(StandardRole.ROLE_SUBSCRIPTION_ADMINISTRATOR);
        try {
            entityService.deleteEntities(ids, SystemUser.class);
            Assertions.fail("Security exception expected");
        } catch (PlatformException ex) {
            Assertions.assertTrue(true);
        }
    }
    
    @DisplayName("Search entities")
    @Test
    public void testSearchEntities() throws Exception {
        auth(StandardRole.ROLE_SUBSCRIPTION_ADMINISTRATOR);
        ContactAdmin entity = new ContactAdmin();
        entity.setLastname("Dowson");
        entityService.createEntity(entity);
        EntitySearchRequest searchRequest = new EntitySearchRequest();
        searchRequest.setPage(1);
        searchRequest.setPageSize(Integer.MAX_VALUE);
        EntitySearchResponse response = entityService.searchEntities(ContactAdmin.class, searchRequest);
        Assertions.assertEquals(1, response.getData().size());
        auth(StandardRole.ROLE_SUBSCRIPTION_USER);
        try {
            entityService.searchEntities(ContactAdmin.class, searchRequest);
            Assertions.fail("Security exception expected");
        } catch (PlatformSecurityException ex) {
            Assertions.assertEquals(EntityPermission.READ, ex.getEntityPermission());
        }
    }
    
    @DisplayName("Get data for collection field")
    @Test
    public void testGetDataForCollectionField() throws Exception {
        auth(StandardRole.ROLE_SUBSCRIPTION_ADMINISTRATOR);
        try {
            entityService.getDataForCollectionField(Subscription.class, "modules");
            Assertions.fail("Security exception expected");
        } catch (PlatformSecurityException ex) {
            Assertions.assertEquals(EntityPermission.READ, ex.getEntityPermission());
        }
        auth(StandardRole.ROLE_SUPER_ADMIN);
        List result = entityService.getDataForCollectionField(Subscription.class, "modules");
        Assertions.assertTrue(!result.isEmpty());
    }
    
    @DisplayName("Deactivate entity")
    @Test
    public void testDeactivateEntity() throws Exception {
        auth(StandardRole.ROLE_SUBSCRIPTION_ADMINISTRATOR);
        SystemUser entity = dataFactory.getSystemUser(
                StandardRole.ROLE_SUBSCRIPTION_USER, "al@test.com", "ijsdf", "Mike", "McMur");
        entity = entityService.createEntity(entity);
        Assertions.assertTrue(entity.isActive());
        auth(StandardRole.ROLE_SUBSCRIPTION_USER);
        Set<Long> ids = new HashSet<>();
        ids.add(entity.getId());
        try {
            entityService.deactivateEntities(ids, SystemUser.class);
            Assertions.fail("Security exception expected");
        } catch (PlatformSecurityException ex) {
            Assertions.assertEquals(EntityPermission.DELETE, ex.getEntityPermission());
        }
        auth(StandardRole.ROLE_SUBSCRIPTION_ADMINISTRATOR);
        entityService.deactivateEntities(ids, SystemUser.class);
    }
}
