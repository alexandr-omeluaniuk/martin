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
package ss.martin.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import ss.martin.platform.anno.ui.Avatar;
import ss.martin.platform.anno.ui.CardSubTitle;
import ss.martin.platform.anno.ui.CardTitle;
import ss.martin.platform.anno.ui.FormField;
import ss.martin.platform.anno.ui.HiddenField;
import ss.martin.platform.anno.ui.ListViewColumn;
import ss.martin.platform.anno.ui.MaterialIcon;
import ss.martin.platform.anno.ui.SideBarNavigationItem;
import ss.martin.platform.constants.AppConstants;
import ss.martin.platform.constants.RepresentationComponentType;
import ss.martin.platform.security.StandardRole;
import ss.martin.platform.security.SystemUserStatus;

/**
 * SystemUser.
 * @author Alexandr Omeluaniuk
 */
@Entity
@Table(name = "users")
@MaterialIcon(icon = "supervisor_account")
@SideBarNavigationItem(roles = { StandardRole.ROLE_SUBSCRIPTION_ADMINISTRATOR },
        component = RepresentationComponentType.LIST_VIEW)
public class SystemUser extends TenantEntity implements HasAvatar {
    /** Default UID. */
    private static final long serialVersionUID = 1L;
// ==================================== FIELDS ====================================================
    /** Avatar. */
    @Avatar
    @ListViewColumn
    @FormField(xs = "12")
    @OneToOne(fetch = FetchType.LAZY, orphanRemoval = true, cascade = CascadeType.ALL)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @JoinColumn(name = "avatar")
    private EntityFile avatar;
    /** Has avatar. */
    @HiddenField
    @Column(name = "has_avatar")
    private boolean hasAvatar;
    /** Email. */
    @Email
    @FormField(xs = "12")
    @ListViewColumn
    @NotEmpty
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @Column(name = "email", nullable = false, length = AppConstants.SIMPLE_TEXT_SIZE)
    private String email;
    /** Password. */
    @JsonIgnore
    @HiddenField
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @Column(name = "password", length = AppConstants.SIMPLE_TEXT_SIZE)
    private String password;
    /** First name. */
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @FormField(xs = "6")
    @CardSubTitle
    @ListViewColumn
    @Column(name = "firstname", length = AppConstants.SIMPLE_TEXT_SIZE)
    private String firstname;
    /** Last name. */
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @FormField(xs = "6")
    @CardTitle
    @ListViewColumn
    @NotEmpty
    @Column(name = "lastname", nullable = false, length = AppConstants.SIMPLE_TEXT_SIZE)
    private String lastname;
    /** Status. */
    @NotNull
    @HiddenField
    @ListViewColumn
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SystemUserStatus status;
    /** Standard role. */
    @NotNull
    @HiddenField
    @ListViewColumn
    @Enumerated(EnumType.STRING)
    @Column(name = "standard_role", nullable = false)
    private StandardRole standardRole;
    /** Validation string for registration. */
    @HiddenField
    @Column(name = "validation_string")
    private String validationString;
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
     * @return the avatar
     */
    @Override
    public EntityFile getAvatar() {
        return avatar;
    }
    /**
     * @param avatar the avatar to set
     */
    public void setAvatar(EntityFile avatar) {
        this.avatar = avatar;
    }
    /**
     * @return the hasAvatar
     */
    @Override
    public boolean isHasAvatar() {
        return hasAvatar;
    }
    /**
     * @param hasAvatar the hasAvatar to set
     */
    @Override
    public void setHasAvatar(boolean hasAvatar) {
        this.hasAvatar = hasAvatar;
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
        return "ss.martin.platform.entity.SystemUser[ id=" + getId() + " ]";
    }
}
