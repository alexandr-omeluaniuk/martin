/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ss.martin.platform.spring.security;

import io.jsonwebtoken.ExpiredJwtException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.util.Base64;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import ss.martin.platform.security.SecurityContext;

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
                LOG.info("Unable to get JWT Token");
            } catch (ExpiredJwtException e) {
                LOG.info("JWT Token has expired");
            } catch (Exception ex) {
                LOG.info("Invalid JWT token format");
            }
        } else {
            LOG.debug("JWT Token does not begin with Bearer String");
        }
        // Once we get the token validate it.
        UserPrincipal principal = SecurityContext.principal();
        if (username != null && principal == null) {
            // if token is valid configure Spring Security to manually set
            // authentication
            if (jwtTokenUtil.validateToken(jwtToken, username)) {
                principal = jwtTokenUtil.getClaimFromToken(jwtToken, (claims) -> {
                    try {
                        String payload = claims.get(JwtToken.CLAIM_KEY_PRINCIPAL, String.class);
                        ByteArrayInputStream bais = new ByteArrayInputStream(Base64.getDecoder().decode(payload));
                        ObjectInputStream objectInputStream = new ObjectInputStream(bais);
                        UserPrincipal p = (UserPrincipal) objectInputStream.readObject();
                        bais.close();
                        objectInputStream.close();
                        return p;
                    } catch (Exception ex) {
                        LOG.info("Can not deserialize '" + JwtToken.CLAIM_KEY_PRINCIPAL + "' claim value", ex);
                        return null;
                    }
                });
                // After setting the Authentication in the context, we specify
                // that the current user is authenticated. So it passes the
                // Spring Security Configurations successfully.
                SecurityContextHolder.getContext().setAuthentication(principal);
            }
        }
        // otherwise without principal will be 401 error
        chain.doFilter(request, response);
    }
}
