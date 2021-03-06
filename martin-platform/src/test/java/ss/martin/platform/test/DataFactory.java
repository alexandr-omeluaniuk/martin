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
package ss.martin.platform.test;

import java.util.Date;
import org.springframework.stereotype.Service;
import ss.entity.martin.Subscription;
import ss.entity.martin.SystemUser;
import ss.martin.platform.security.StandardRole;
import ss.martin.platform.security.SystemUserStatus;

/**
 *
 * @author ss
 */
@Service
public class DataFactory {
    
    public Subscription getSubscription() {
        Subscription model = new Subscription();
        model.setExpirationDate(new Date());
        model.setStarted(new Date());
        model.setOrganizationName("Test subscription");
        model.setSubscriptionAdminEmail("test@test.com");
        return model;
    }
    
    public SystemUser getSystemUser(
            StandardRole role, String username, String password, String firstname, String lastname) {
        SystemUser model = new SystemUser();
        model.setActive(true);
        model.setEmail(username);
        model.setFirstname(firstname);
        model.setLastname(lastname);
        model.setPassword(password);
        model.setStatus(SystemUserStatus.ACTIVE);
        model.setStandardRole(role);
        return model;
    }
}
