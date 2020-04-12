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
package ss.martin.platform.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import ss.martin.platform.anno.ui.FormField;
import ss.martin.platform.anno.ui.HTMLEditor;
import ss.martin.platform.anno.ui.ListViewColumn;
import ss.martin.platform.constants.AppConstants;

/**
 * Email template.
 * @author ss
 */
@Entity
@Table(name = "email_template")
public class EmailTemplate extends EntityAudit implements Undeletable {
    /** Default UID. */
    private static final long serialVersionUID = 1L;
// =============================================== FIELDS =============================================================
    /** Email subject. */
    @ListViewColumn
    @FormField(xs = "12")
    @NotNull
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @Column(name = "subject", nullable = false, length = AppConstants.SIMPLE_TEXT_SIZE)
    private String subject;
    /** Email content. */
    @ListViewColumn
    @FormField(xs = "12")
    @HTMLEditor
    @NotNull
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @Column(name = "content", nullable = false, length = AppConstants.LONG_TEXT_SIZE)
    private String content;
    /** Active. */
    @Column(name = "active", nullable = false)
    private boolean active;
// =============================================== SET & GET ==========================================================
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
     * @return the content
     */
    public String getContent() {
        return content;
    }
    /**
     * @param content the content to set
     */
    public void setContent(String content) {
        this.content = content;
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
// ====================================================================================================================
    @Override
    public int hashCode() {
        int hash = 0;
        hash += (getId() != null ? getId().hashCode() : 0);
        return hash;
    }
    @Override
    public boolean equals(Object object) {
        if (!(object instanceof EmailTemplate)) {
            return false;
        }
        EmailTemplate other = (EmailTemplate) object;
        return !((this.getId() == null && other.getId() != null)
                || (this.getId() != null && !this.getId().equals(other.getId())));
    }
    @Override
    public String toString() {
        return "ss.martin.platform.entity.EmailTemplate[ id=" + getId() + " ]";
    }
}
