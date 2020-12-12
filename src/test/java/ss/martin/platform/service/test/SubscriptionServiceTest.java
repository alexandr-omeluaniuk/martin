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
import org.springframework.security.access.AccessDeniedException;
import ss.martin.platform.dao.UserDAO;
import ss.martin.platform.entity.Subscription;
import ss.martin.platform.entity.SystemUser;
import ss.martin.platform.security.StandardRole;
import ss.martin.platform.security.SystemUserStatus;
import ss.martin.platform.service.SubscriptionService;
import ss.martin.platform.test.AbstractTest;

/**
 * 
 * @author ss
 */
public class SubscriptionServiceTest extends AbstractTest {
    
    @Autowired
    private SubscriptionService subscriptionService;
    
    @Autowired
    private UserDAO userDAO;
    
    @DisplayName("Register new subscription as super admin")
    @Test
    public void testRegisterNewSubscription_ROLE_SUPER_ADMIN() throws Exception {
        auth(StandardRole.ROLE_SUPER_ADMIN);
        final String email = "newsubscription@domain.com";
        Subscription subscription = dataFactory.getSubscription();
        subscription.setSubscriptionAdminEmail(email);
        subscriptionService.createSubscription(subscription);
        SystemUser systemUser = userDAO.findByUsername(email);
        Assertions.assertEquals(StandardRole.ROLE_SUBSCRIPTION_ADMINISTRATOR, systemUser.getStandardRole());
        Assertions.assertNotNull(systemUser.getValidationString());
        Assertions.assertNull(systemUser.getPassword());
        Assertions.assertEquals(SystemUserStatus.REGISTRATION, systemUser.getStatus());
    }
    @DisplayName("Register new subscription as subscription admin")
    @Test
    public void testRegisterNewSubscription_ROLE_SUBSCRIPTION_ADMINISTRATOR() throws Exception {
        auth(StandardRole.ROLE_SUBSCRIPTION_ADMINISTRATOR);
        final String email = "newsubscription@domain.com";
        Subscription subscription = dataFactory.getSubscription();
        subscription.setSubscriptionAdminEmail(email);
        try {
            subscriptionService.createSubscription(subscription);
            Assertions.fail("Must be error!");
        } catch (AccessDeniedException ex) {
            Assertions.assertNotNull(ex);
        }
    }
    @DisplayName("Register new subscription as subscription user")
    @Test
    public void testRegisterNewSubscription_ROLE_SUBSCRIPTION_USER() throws Exception {
        auth(StandardRole.ROLE_SUBSCRIPTION_USER);
        final String email = "newsubscription@domain.com";
        Subscription subscription = dataFactory.getSubscription();
        subscription.setSubscriptionAdminEmail(email);
        try {
            subscriptionService.createSubscription(subscription);
            Assertions.fail("Must be error!");
        } catch (AccessDeniedException ex) {
            Assertions.assertNotNull(ex);
        }
    }
}
