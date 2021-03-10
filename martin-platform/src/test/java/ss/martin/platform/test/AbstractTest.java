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

import java.util.ArrayList;
import java.util.List;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import ss.entity.martin.Subscription;
import ss.entity.martin.SystemUser;
import ss.martin.platform.dao.UserDAO;
import ss.martin.platform.security.StandardRole;
import ss.martin.platform.service.EntityService;
import ss.martin.platform.spring.config.ModuleConfig;
import ss.martin.platform.spring.security.UserPrincipal;

/**
 *
 * @author ss
 */
@SpringBootTest(classes = { ModuleConfig.class }, webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@Transactional
public abstract class AbstractTest {
    
    protected static final String SUPER_ADMIN_USERNAME = "superadmin@domain.com";
    
    protected static final String SUPER_ADMIN_PASSWORD = "password";
    
    protected static final String SUBSCRIPTION_ADMIN_USERNAME = "subscription.admin@domain.com";
    
    protected static final String SUBSCRIPTION_ADMIN_PASSWORD = "password";
    
    protected static final String SUBSCRIPTION_USER_USERNAME = "subscription.user@domain.com";
    
    protected static final String SUBSCRIPTION_USER_PASSWORD = "password";
    
    @Autowired
    private EntityService entityService;
    
    @Autowired
    private UserDAO userDAO;
    
    @Autowired
    protected DataFactory dataFactory;
    
    @Autowired
    private WebApplicationContext webApplicationContext;
    
    protected MockMvc mvc;
    
    @PostConstruct
    @Transactional(propagation = Propagation.REQUIRED)
    public void beforeEveryTest() throws Exception {
        mvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).apply(springSecurity()).build();
        if (userDAO.findByUsername(SUBSCRIPTION_ADMIN_USERNAME) == null) {
            auth(StandardRole.ROLE_SUPER_ADMIN);
            Subscription subscription = dataFactory.getSubscription();
            subscription.setSubscriptionAdminEmail(SUBSCRIPTION_ADMIN_USERNAME);
            entityService.create(subscription);
        }
        if (userDAO.findByUsername(SUBSCRIPTION_USER_USERNAME) == null) {
            auth(StandardRole.ROLE_SUBSCRIPTION_ADMINISTRATOR);
            SystemUser subscriptionUser = dataFactory.getSystemUser(StandardRole.ROLE_SUBSCRIPTION_USER,
                    SUBSCRIPTION_USER_USERNAME, SUBSCRIPTION_USER_PASSWORD, "John", "Murrey");
            entityService.create(subscriptionUser);
        }
    }
    
    protected void auth(StandardRole role) {
        SystemUser user = null;
        if (StandardRole.ROLE_SUPER_ADMIN == role) {
            user = userDAO.findByUsername(SUPER_ADMIN_USERNAME);
        } else if (StandardRole.ROLE_SUBSCRIPTION_ADMINISTRATOR == role) {
            user = userDAO.findByUsername(SUBSCRIPTION_ADMIN_USERNAME);
        } else if (StandardRole.ROLE_SUBSCRIPTION_USER == role) {
            user = userDAO.findByUsername(SUBSCRIPTION_USER_USERNAME);
        }
        if (user == null) {
            throw new RuntimeException("User is not found! Authentication failed...");
        }
        GrantedAuthority ga = new SimpleGrantedAuthority(user.getStandardRole().name());
        List<GrantedAuthority> gaList = new ArrayList<>();
        gaList.add(ga);
        UserPrincipal principal = new UserPrincipal(SUPER_ADMIN_USERNAME, user.getPassword(), gaList);
        principal.setUser(user);
        SecurityContextHolder.getContext().setAuthentication(principal);
    }
}
