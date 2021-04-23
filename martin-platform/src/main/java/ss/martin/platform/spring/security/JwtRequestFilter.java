/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ss.martin.platform.spring.security;

import io.jsonwebtoken.ExpiredJwtException;
import java.io.IOException;
import java.util.ArrayList;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import ss.martin.platform.security.SecurityContext;
import ss.martin.platform.service.SecurityService;
import ss.martin.platform.spring.config.PlatformConfiguration;

/**
 * JWT filter.
 * @author alex
 */
@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    /** Logger. */
    private static final Logger LOG = LoggerFactory.getLogger(JwtRequestFilter.class);
    /** JWT token utility. */
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    /** Authentication manager. */
    @Autowired
    private AuthManager authManager;
    /** Platform configuration. */
    @Autowired
    private PlatformConfiguration configuration;
    /** Security service. */
    @Autowired
    private SecurityService securityService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        final String requestTokenHeader = request.getHeader("Authorization");
        String username = null;
        String jwtToken = null;
        // JWT Token is in the form "Bearer token". Remove Bearer word and get only the Token
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtTokenUtil.getUsernameFromToken(jwtToken);
            } catch (IllegalArgumentException e) {
                LOG.warn("Unable to get JWT Token");
            } catch (ExpiredJwtException e) {
                LOG.info("JWT Token has expired");
            }
        } else {
            LOG.info("JWT Token does not begin with Bearer String");
        }
        // Once we get the token validate it.
        UserPrincipal principal = SecurityContext.principal();
        if (username != null && principal == null) {
            // if token is valid configure Spring Security to manually set
            // authentication
            if (jwtTokenUtil.validateToken(jwtToken, username)) {
                Authentication a = authManager.authenticate(
                        new UserPrincipal(username, configuration.getJwt().getSecret(), new ArrayList<>()));
                // After setting the Authentication in the context, we specify
                // that the current user is authenticated. So it passes the
                // Spring Security Configurations successfully.
                SecurityContextHolder.getContext().setAuthentication(a);
                principal = SecurityContext.principal();
                principal.setUserAgent(securityService.getUserAgent(request));
            }
        }
        // otherwise without principal will be 401 error
        chain.doFilter(request, response);
    }
}
