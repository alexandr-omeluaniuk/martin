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

import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import ss.martin.platform.anno.ui.FormField;
import ss.martin.platform.anno.ui.ListViewColumn;
import ss.martin.platform.constants.AppConstants;
import ss.martin.platform.constants.ListViewColumnAlign;

/**
 * Calendar event.
 * @author ss
 */
@MappedSuperclass
public abstract class CalendarEvent extends EntityAudit {
// ============================================ FIELDS ================================================================
    /** Event start datetime. */
    @ListViewColumn(align = ListViewColumnAlign.right)
    @FormField(lg = "6", md = "6", sm = "12")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = AppConstants.DEFAULT_DATETIME_FORMAT)
    @Temporal(TemporalType.TIMESTAMP)
    @NotNull
    @Column(name = "event_start", nullable = false)
    private Date start;
    /** Event start datetime. */
    @ListViewColumn(align = ListViewColumnAlign.right)
    @FormField(lg = "6", md = "6", sm = "12")
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = AppConstants.DEFAULT_DATETIME_FORMAT)
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "event_end", nullable = false)
    private Date end;
// ============================================ SET & GET =============================================================
    /**
     * @return the start
     */
    public Date getStart() {
        return start;
    }
    /**
     * @param start the start to set
     */
    public void setStart(Date start) {
        this.start = start;
    }
    /**
     * @return the end
     */
    public Date getEnd() {
        return end;
    }
    /**
     * @param end the end to set
     */
    public void setEnd(Date end) {
        this.end = end;
    }
}
