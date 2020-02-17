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
package ss.martin.platform.service.impl;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import ss.martin.platform.constants.AppURLs;
import ss.martin.platform.dao.CoreDAO;
import ss.martin.platform.dao.UserDAO;
import ss.martin.platform.entity.Subscription;
import ss.martin.platform.entity.SystemUser;
import ss.martin.platform.exception.RegistrationUserException;
import ss.martin.platform.service.SystemUserService;
import ss.martin.platform.spring.config.PlatformConfiguration;
import ss.martin.platform.security.SecurityContext;
import ss.martin.platform.security.StandardRole;
import ss.martin.platform.security.SystemUserStatus;

/**
 * System user service implementation.
 * @author ss
 */
@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
class SystemUserServiceImpl implements SystemUserService {
    /** Logger. */
    private static final Logger LOG = LoggerFactory.getLogger(SystemUserService.class);
    /** Core DAO. */
    @Autowired
    private CoreDAO coreDAO;
    /** User DAO. */
    @Autowired
    private UserDAO userDAO;
    /** Email service. */
    @Autowired
    private JavaMailSender emailService;
    /** Password encoder. */
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    /** Platform configuration. */
    @Autowired
    private PlatformConfiguration config;
    /** Security context. */
    @Autowired
    private SecurityContext securityContext;
// =================================================== PUBLIC =========================================================
    @Override
    public void startRegistration(SystemUser systemUser) throws Exception {
        if (userDAO.findByUsername(systemUser.getEmail()) != null) {
            throw new RegistrationUserException(RegistrationUserException.CODE_DUPLICATE_USER);
        }
        String validationString = UUID.randomUUID().toString();
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(systemUser.getEmail());
        msg.setSubject("Регистрация нового пользователя");
        msg.setText("Пройдите по ссылке: " + config.getServerDomain()
                + AppURLs.APP_CRM_FINISH_REGISTRATION + "/" + validationString);
        systemUser.setStatus(SystemUserStatus.REGISTRATION);
        systemUser.setValidationString(validationString);
        if (securityContext.currentUser().getStandardRole() == StandardRole.ROLE_SUPER_ADMIN) {
            coreDAO.createIgnoreSubscription(systemUser);
        } else {
            coreDAO.create(systemUser);
        }
        emailService.send(msg);
    }
    @Override
    public void finishRegistration(String validationString, String password) throws Exception {
        SystemUser systemUser = userDAO.getUserByValidationString(validationString);
        systemUser.setValidationString(null);
        systemUser.setStatus(SystemUserStatus.ACTIVE);
        systemUser.setPassword(bCryptPasswordEncoder.encode(password));
        coreDAO.update(systemUser);
    }
    @Override
    @Transactional(propagation = Propagation.REQUIRED)
    public void superUserCheck() {
        SystemUser superAdmin = userDAO.getSuperUser();
        if (superAdmin == null && config.getSuperAdminEmail() != null
                && config.getSuperAdminLastName() != null && config.getSuperAdminPassword() != null) {
            LOG.info("super user is not exist, create it...");
            try {
                Calendar calendar = new GregorianCalendar();
                calendar.setTime(new Date());
                Subscription superAdminSubscription = new Subscription();
                superAdminSubscription.setStarted(calendar.getTime());
                calendar.add(Calendar.YEAR, 33);
                superAdminSubscription.setExpirationDate(calendar.getTime());
                superAdminSubscription.setOrganizationName("Super Admin subscription");
                superAdminSubscription.setSubscriptionAdminEmail(config.getSuperAdminEmail());
                superAdminSubscription = coreDAO.createIgnoreSubscription(superAdminSubscription);
                superAdmin = new SystemUser();
                superAdmin.setSubscription(superAdminSubscription);
                superAdmin.setEmail(config.getSuperAdminEmail());
                superAdmin.setFirstname(config.getSuperAdminFirstName());
                superAdmin.setLastname(config.getSuperAdminLastName());
                superAdmin.setPassword(bCryptPasswordEncoder.encode(config.getSuperAdminPassword()));
                superAdmin.setStandardRole(StandardRole.ROLE_SUPER_ADMIN);
                superAdmin.setStatus(SystemUserStatus.ACTIVE);
                coreDAO.create(superAdmin);
            } catch (Exception e) {
                LOG.warn("Unexpected error occurred during super user creation.", e);
            }
        }
    }
    @Override
    public SystemUser createSystemUser(SystemUser user) throws Exception {
        user.setStandardRole(StandardRole.ROLE_SUBSCRIPTION_USER);
        user.setSubscription(securityContext.currentUser().getSubscription());
        startRegistration(user);
        return user;
    }
}
