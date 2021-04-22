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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import ss.martin.platform.security.SecurityContext;
import ss.martin.platform.spring.config.PlatformConfiguration;

/**
 * JWT filter.
 * @author alex
 */
@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    /** JWT token utility. */
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    /** Authentication manager. */
    @Autowired
    private AuthManager authManager;
    /** Platform configuration. */
    @Autowired
    private PlatformConfiguration configuration;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        if (request.getRequestURI().equals("/api/account/register")
                || request.getRequestURI().equals("/api/account/login")) {
            chain.doFilter(request, response);
            return;
        }
        final String requestTokenHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;
        // JWT Token is in the form "Bearer token". Remove Bearer word and get
        // only the Token
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtTokenUtil.getUsernameFromToken(jwtToken);
            } catch (IllegalArgumentException e) {
                System.out.println("Unable to get JWT Token");
            } catch (ExpiredJwtException e) {
                System.out.println("JWT Token has expired");
            }
        } else {
            logger.warn("JWT Token does not begin with Bearer String");
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
            }
        }
        chain.doFilter(request, response);
    }
}
