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
package ss.martin.module.crm.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import ss.martin.platform.anno.ui.FormField;
import ss.martin.platform.anno.ui.ListViewColumn;
import ss.martin.platform.anno.ui.MaterialIcon;
import ss.martin.platform.anno.validation.MobilePhoneNumber;
import ss.martin.platform.constants.ListViewColumnAlign;
import ss.martin.platform.anno.ui.Avatar;
import ss.martin.platform.anno.ui.CardSubTitle;
import ss.martin.platform.anno.ui.CardTitle;
import ss.martin.platform.anno.ui.HiddenField;
import ss.martin.platform.constants.AppConstants;
import ss.martin.platform.entity.EntityAudit;

/**
 * Contact.
 * @author ss
 */
@Entity
@Table(name = "contact")
@MaterialIcon(icon = "perm_identity")
public class Contact extends EntityAudit {
    /** Default UID. */
    private static final long serialVersionUID = 1L;
// ========================================== FIELDS ==================================================================
    /** Contact avatar. Image as base64 string. */
    @Avatar
    @ListViewColumn
    @FormField(xs = "12")
    @Column(name = "avatar", length = AppConstants.LONG_TEXT_SIZE)
    private String avatar;
    /** First name. */
    @ListViewColumn
    @FormField(lg = "6", md = "6", sm = "12")
    @CardSubTitle
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @Column(name = "firstname", length = AppConstants.SIMPLE_TEXT_SIZE)
    private String firstname;
    /** Last name. */
    @ListViewColumn
    @FormField(lg = "6", md = "6", sm = "12")
    @CardTitle
    @NotEmpty
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @Column(name = "lastname", length = AppConstants.SIMPLE_TEXT_SIZE, nullable = false)
    private String lastname;
    /** Email. */
    @ListViewColumn
    @FormField(lg = "6", md = "6", sm = "12")
    @Email
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @Column(name = "email", length = AppConstants.SIMPLE_TEXT_SIZE)
    private String email;
    /** Mobile phone. */
    @ListViewColumn(align = ListViewColumnAlign.right)
    @FormField(lg = "6", md = "6", sm = "12")
    @MobilePhoneNumber
    @Column(name = "phone_mobile", length = 17)
    private String phoneMobile;
    /** Contact visits. */
    @HiddenField
    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "contact")
    private List<ContactVisit> visits;
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
    /**
     * @return the avatar
     */
    public String getAvatar() {
        return avatar;
    }
    /**
     * @param avatar the avatar to set
     */
    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
    /**
     * @return the visits
     */
    public List<ContactVisit> getVisits() {
        return visits;
    }
    /**
     * @param visits the visits to set
     */
    public void setVisits(List<ContactVisit> visits) {
        this.visits = visits;
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