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
package ss.martin.platform.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import ss.entity.martin.SystemUser;
import ss.martin.platform.dao.CoreDAO;
import ss.martin.platform.security.SecurityContext;
import ss.martin.platform.service.SecurityService;
import ss.martin.platform.wrapper.UserPermissions;

/**
 * Security REST controller.
 * @author ss
 */
@RestController
@RequestMapping("/api/platform/security")
public class SecurityRESTController {
    /** Security service. */
    @Autowired
    private SecurityService securityService;
    /** Core DAO. */
    @Autowired
    private CoreDAO coreDAO;
    /**
     * Get user permissions.
     * @return user permissions.
     * @throws Exception error.
     */
    @RequestMapping(value = "/permissions", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public UserPermissions getUserPermissions() throws Exception {
        return securityService.getUserPermissions();
    }
    /**
     * Save Firebase client token.
     * @param token Firebase token.
     * @throws Exception error.
     */
    @RequestMapping(value = "/firebase-token", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public void saveFirebaseToken(@RequestBody String token) throws Exception {
        SystemUser user = SecurityContext.currentUser();
        if (user.getFirebaseToken() == null) {
            user.setFirebaseToken(token);
            coreDAO.update(user);
        }
    }
}
