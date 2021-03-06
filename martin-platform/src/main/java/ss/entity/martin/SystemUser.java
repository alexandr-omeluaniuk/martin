/*
 * The MIT License
 *
 * Copyright 2018 Wisent Media.
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

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import ss.martin.platform.anno.security.EntityAccess;
import ss.martin.platform.anno.security.FormField;
import ss.martin.platform.constants.AppConstants;
import ss.martin.platform.security.StandardRole;
import ss.martin.platform.security.SystemUserStatus;

/**
 * SystemUser.
 * @author Alexandr Omeluaniuk
 */
@Entity
@Table(name = "users")
@EntityAccess(roles = { StandardRole.ROLE_SUBSCRIPTION_ADMINISTRATOR })
public class SystemUser extends TenantEntity implements SoftDeleted {
    /** Default UID. */
    private static final long serialVersionUID = 1L;
// ==================================== FIELDS ====================================================
    /** Email. */
    @Email
    @FormField
    @NotEmpty
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @Column(name = "email", nullable = false, length = AppConstants.SIMPLE_TEXT_SIZE)
    private String email;
    /** Password. */
    @JsonIgnore
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @Column(name = "password", length = AppConstants.SIMPLE_TEXT_SIZE)
    private String password;
    /** First name. */
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @FormField
    @Column(name = "firstname", length = AppConstants.SIMPLE_TEXT_SIZE)
    private String firstname;
    /** Last name. */
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @FormField
    @NotEmpty
    @Column(name = "lastname", nullable = false, length = AppConstants.SIMPLE_TEXT_SIZE)
    private String lastname;
    /** Status. */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SystemUserStatus status;
    /** Standard role. */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "standard_role", nullable = false)
    private StandardRole standardRole;
    /** Validation string for registration. */
    @Column(name = "validation_string")
    private String validationString;
    /** Active. */
    @Column(name = "active", nullable = false)
    private boolean active;
// ==================================== SET & GET =================================================
    /**
     * @return the email
     */
    public String getEmail() {
        return email;
    }
    /**
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }
    /**
     * @return the password
     */
    public String getPassword() {
        return password;
    }
    /**
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }
    /**
     * @return the firstname
     */
    public String getFirstname() {
        return firstname;
    }
    /**
     * @param firstname the firstname to set
     */
    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }
    /**
     * @return the lastName
     */
    public String getLastname() {
        return lastname;
    }
    /**
     * @param lastname the lastName to set
     */
    public void setLastname(String lastname) {
        this.lastname = lastname;
    }
    /**
     * @return the standardRole
     */
    public StandardRole getStandardRole() {
        return standardRole;
    }
    /**
     * @param standardRole the standardRole to set
     */
    public void setStandardRole(StandardRole standardRole) {
        this.standardRole = standardRole;
    }
    /**
     * @return the validationString
     */
    public String getValidationString() {
        return validationString;
    }
    /**
     * @param validationString the validationString to set
     */
    public void setValidationString(String validationString) {
        this.validationString = validationString;
    }
    /**
     * @return the status
     */
    public SystemUserStatus getStatus() {
        return status;
    }
    /**
     * @param status the status to set
     */
    public void setStatus(SystemUserStatus status) {
        this.status = status;
    }
    /**
     * @return the active
     */
    @Override
    public boolean isActive() {
        return active;
    }
    /**
     * @param active the active to set
     */
    @Override
    public void setActive(boolean active) {
        this.active = active;
    }
// ================================================================================================
    @Override
    public int hashCode() {
        int hash = 0;
        hash += (getId() != null ? getId().hashCode() : 0);
        return hash;
    }
    @Override
    public boolean equals(Object object) {
        if (!(object instanceof SystemUser)) {
            return false;
        }
        SystemUser other = (SystemUser) object;
        return !((this.getId() == null && other.getId() != null)
                || (this.getId() != null && !this.getId().equals(other.getId())));
    }
    @Override
    public String toString() {
        return "ss.entity.martin.SystemUser[ id=" + getId() + " ]";
    }
}
