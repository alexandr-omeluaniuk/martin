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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import ss.martin.platform.anno.ui.FormField;
import ss.martin.platform.anno.ui.LookupField;
import ss.martin.platform.anno.ui.MaterialIcon;
import ss.martin.platform.anno.ui.TextArea;
import ss.martin.platform.constants.AppConstants;
import ss.martin.platform.entity.CalendarEvent;

/**
 * Contact visit.
 * @author ss
 */
@Entity
@MaterialIcon(icon = "directions_car")
@Table(name = "contact_visit")
public class ContactVisit extends CalendarEvent {
// ================================================= FIELDS ===========================================================
    /** Subject. */
    @FormField(lg = "6", md = "6", sm = "12")
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @Column(name = "subject", length = AppConstants.SIMPLE_TEXT_SIZE)
    private String subject;
    /** Contact. */
    @NotNull
    @LookupField(template = "{firstname} {lastname}", orderBy = "lastname")
    @FormField(lg = "6", md = "6", sm = "12")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact;
    /** Note. */
    @TextArea(rows = 2)
    @FormField(xs = "12")
    @Size(max = AppConstants.LONG_TEXT_SIZE)
    @Column(name = "note", length = AppConstants.LONG_TEXT_SIZE)
    private String note;
// ================================================= SET & GET ========================================================    
    /**
     * @return the subject
     */
    public String getSubject() {
        return subject;
    }
    /**
     * @param subject the subject to set
     */
    public void setSubject(String subject) {
        this.subject = subject;
    }
    /**
     * @return the contact
     */
    public Contact getContact() {
        return contact;
    }
    /**
     * @param contact the contact to set
     */
    public void setContact(Contact contact) {
        this.contact = contact;
    }
    /**
     * @return the note
     */
    public String getNote() {
        return note;
    }
    /**
     * @param note the note to set
     */
    public void setNote(String note) {
        this.note = note;
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
        if (!(object instanceof ContactVisit)) {
            return false;
        }
        ContactVisit other = (ContactVisit) object;
        return !((this.getId() == null && other.getId() != null)
                || (this.getId() != null && !this.getId().equals(other.getId())));
    }
    @Override
    public String toString() {
        return "ss.martin.module.crm.entity.ContactVisit[ id=" + getId() + " ]";
    }
}
