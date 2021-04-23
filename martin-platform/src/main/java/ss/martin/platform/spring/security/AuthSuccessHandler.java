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
package ss.martin.platform.spring.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import ss.entity.martin.UserAgent;
import ss.martin.platform.dao.CoreDAO;
import ss.martin.platform.security.SecurityContext;
import ss.martin.platform.spring.config.PlatformConfiguration;

/**
 * Authentication success handler.
 * @author Alexandr Omeluaniuk
 */
@Component
class AuthSuccessHandler implements AuthenticationSuccessHandler {
    /** Logger. */
    private static final org.slf4j.Logger LOG = LoggerFactory.getLogger(AuthSuccessHandler.class);
    /** Core DAO. */
    @Autowired
    private CoreDAO coreDAO;
    /** Platform configuration. */
    @Autowired
    private PlatformConfiguration configuration;
    @Override
    public void onAuthenticationSuccess(HttpServletRequest hsr, HttpServletResponse hsr1,
            Authentication a) throws IOException, ServletException {
        hsr1.setStatus(HttpStatus.OK.value());
        UserPrincipal principal = SecurityContext.principal();
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setMessage("Welcome to Martin platform");
        if (configuration.getJwt() != null) {
            loginResponse.setJwt(principal.getJwtToken().getToken());
        }
        hsr1.getOutputStream().println(new ObjectMapper().writeValueAsString(loginResponse));
        // save user agent
        String userAgentString = hsr.getHeader("User-Agent");
        List<UserAgent> userAgents = principal.getUserAgents();
        UserAgent userAgent = userAgents.stream().filter(ua -> {
            return userAgentString.equals(ua.getUserAgentString());
        }).findFirst().map(ua -> ua).orElseGet(() -> {
            UserAgent ua = new UserAgent();
            ua.setUserAgentString(userAgentString);
            try {
                coreDAO.create(ua);
            } catch (Exception ex) {
                LOG.error("can't create new user agent.", ex);
            }
            principal.getUserAgents().add(ua);
            return ua;
        });
        principal.setUserAgent(userAgent);
    }
}
