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
package ss.entity.martin;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * User agent.
 * @author alex
 */
@Entity
@Table(name = "user_agents")
public class UserAgent extends EntityAudit {
    // ============================================= FIELDS ===========================================================
    /** User agent string. */
    @NotNull
    @Size(max = 1000)
    @Column(name = "user_agent_string", nullable = false, length = 1000)
    private String userAgentString;
    /** Firebase token. */
    @Size(max = 255)
    @Column(name = "firebase_token", length = 255)
    private String firebaseToken;
    // ============================================= SET & GET ========================================================
    /**
     * @return the userAgentString
     */
    public String getUserAgentString() {
        return userAgentString;
    }
    /**
     * @param userAgentString the userAgentString to set
     */
    public void setUserAgentString(String userAgentString) {
        this.userAgentString = userAgentString;
    }
    /**
     * @return the firebaseToken
     */
    public String getFirebaseToken() {
        return firebaseToken;
    }
    /**
     * @param firebaseToken the firebaseToken to set
     */
    public void setFirebaseToken(String firebaseToken) {
        this.firebaseToken = firebaseToken;
    }
    // ================================================================================================================
    @Override
    public int hashCode() {
        int hash = 0;
        hash += (getId() != null ? getId().hashCode() : 0);
        return hash;
    }
    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof UserAgent)) {
            return false;
        }
        UserAgent other = (UserAgent) object;
        return !((this.getId() == null && other.getId() != null)
                || (this.getId() != null && !this.getId().equals(other.getId())));
    }
    @Override
    public String toString() {
        return "ss.entity.martin.UserAgent[ id=" + getId() + " ]";
    }
}
