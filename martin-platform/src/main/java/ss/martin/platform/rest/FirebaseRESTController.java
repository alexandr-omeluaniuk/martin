/*
 * The MIT License
 *
 * Copyright 2021 alex.
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

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import ss.entity.martin.UserAgent;
import ss.martin.platform.dao.CoreDAO;
import ss.martin.platform.security.SecurityContext;
import ss.martin.platform.service.FirebaseClient;

/**
 * Firebase REST controller.
 * @author alex
 */
@RestController
@RequestMapping("/api/platform/firebase")
public class FirebaseRESTController {
    /** Core DAO. */
    @Autowired
    private CoreDAO coreDAO;
    /** Firebase client. */
    @Autowired
    private FirebaseClient firebaseClient;
    /**
     * Subscribe Firebase notifications.
     * @param topic Firebase notifications topic.
     * @param firebaseToken firebase token.
     * @param userAgentString user agent string.
     * @throws Exception error.
     */
    @RequestMapping(value = "/topic/subscribe/{firebaseToken}/{topic}", method = RequestMethod.PUT,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public void subscribeToTopic(@PathVariable("topic") String topic,
            final @PathVariable("firebaseToken") String firebaseToken,
            final @RequestHeader(value = "User-Agent") String userAgentString) throws Exception {
        UserAgent userAgent = getUserAgent(userAgentString, firebaseToken);
        userAgent.setFirebaseToken(firebaseToken);
        if (SecurityContext.currentUser().equals(userAgent.getCreatedBy())) {
            coreDAO.update(userAgent);
            Set<UserAgent> set = new HashSet<>();
            set.add(userAgent);
            firebaseClient.subscribeToTopic(topic, set);
        }
    }
    /**
     * Unsubscribe Firebase notifications.
     * @param topic Firebase notifications topic.
     * @param firebaseToken firebase token.
     * @param userAgentString user agent string.
     * @throws Exception error.
     */
    @RequestMapping(value = "/topic/unsubscribe/{firebaseToken}/{topic}", method = RequestMethod.PUT,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public void unsubscribeFirebaseNotifications(@PathVariable("topic") String topic,
            final @PathVariable("firebaseToken") String firebaseToken,
            final @RequestHeader(value = "User-Agent") String userAgentString) throws Exception {
        UserAgent userAgent = getUserAgent(userAgentString, firebaseToken);
        Set<UserAgent> set = new HashSet<>();
        set.add(userAgent);
        firebaseClient.unsubscribeFromTopic(topic, set);
    }
    /**
     * Get user agent by User-Agent string and Firebase token in addition.
     * @param userAgentString User-Agent string.
     * @param firebaseToken Firebase token.
     * @return user agent.
     */
    private UserAgent getUserAgent(String userAgentString, String firebaseToken) {
        List<UserAgent> userAgents = SecurityContext.principal().getUserAgents();
        UserAgent userAgent = userAgents.stream().filter(ua -> {
            return userAgentString.equals(ua.getUserAgentString());
        }).findFirst().get();
        if (userAgent == null) {
            userAgent = userAgents.stream().filter(ua -> {
                return firebaseToken.equals(ua.getFirebaseToken());
            }).findFirst().get();
        }
        return userAgent;
    }
}
