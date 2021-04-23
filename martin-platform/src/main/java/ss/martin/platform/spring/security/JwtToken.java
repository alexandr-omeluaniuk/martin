/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ss.martin.platform.spring.security;

import java.io.Serializable;

/**
 * JWT token.
 * @author alex
 */
public class JwtToken implements Serializable {
    /** UID. */
    private static final long serialVersionUID = -1L;
    /** JWT claim key for principal. */
    public static final String CLAIM_KEY_PRINCIPAL = "PRINCIPAL";
    /** Token. */
    private final String token;
    /**
     * Constructor.
     * @param accessToken JWT token. 
     */
    public JwtToken(String accessToken) {
        token = accessToken;
    }
    /**
     * Get JWT token.
     * @return token.
     */
    public String getToken() {
        return this.token;
    }
}
