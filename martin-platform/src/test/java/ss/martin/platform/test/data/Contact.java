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
package ss.martin.platform.test.data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import ss.entity.martin.EntityAudit;
import ss.martin.platform.anno.security.FormField;
import ss.martin.platform.constants.AppConstants;

/**
 * Contact.
 * @author ss
 */
@Entity
@Table(name = "contact")
public class Contact extends EntityAudit {
    /** Default UID. */
    private static final long serialVersionUID = 1L;
// ========================================== FIELDS ==================================================================
    /** Has avatar. */
    @Column(name = "has_avatar")
    private boolean hasAvatar;
    /** First name. */
    @FormField
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @Column(name = "firstname", length = AppConstants.SIMPLE_TEXT_SIZE)
    private String firstname;
    /** Last name. */
    @FormField
    @NotEmpty
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @Column(name = "lastname", length = AppConstants.SIMPLE_TEXT_SIZE, nullable = false)
    private String lastname;
    /** Email. */
    @FormField
    @Email
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @Column(name = "email", length = AppConstants.SIMPLE_TEXT_SIZE)
    private String email;
    /** Mobile phone. */
    @FormField
    @Column(name = "phone_mobile", length = 17)
    private String phoneMobile;
// ========================================== SET & GET ===============================================================
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
     * @return the lastname
     */
    public String getLastname() {
        return lastname;
    }
    /**
     * @param lastname the lastname to set
     */
    public void setLastname(String lastname) {
        this.lastname = lastname;
    }
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
     * @return the phoneMobile
     */
    public String getPhoneMobile() {
        return phoneMobile;
    }
    /**
     * @param phoneMobile the phoneMobile to set
     */
    public void setPhoneMobile(String phoneMobile) {
        this.phoneMobile = phoneMobile;
    }
// ====================================================================================================================
    @Override
    public int hashCode() {
        int hash = 0;
        hash += (getId() != null ? getId().hashCode() : 0);
        return hash;
    }
    @Override
    public boolean equals(Object object) {
        if (!(object instanceof Contact)) {
            return false;
        }
        Contact other = (Contact) object;
        return !((this.getId() == null && other.getId() != null)
                || (this.getId() != null && !this.getId().equals(other.getId())));
    }
    @Override
    public String toString() {
        return "Contact[ id=" + getId() + " ]";
    }
}
