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

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import ss.martin.platform.constants.AppConstants;
import ss.martin.platform.constants.EntityFileType;
import ss.martin.platform.util.ByteArrayDeserializer;

/**
 * Entity file.
 * @author ss
 */
@Entity
@Table(name = "entity_file")
public class EntityFile extends TenantEntity {
    /** Default UID. */
    private static final long serialVersionUID = 1L;
// ============================================= FIELDS ===============================================================
    /** File binary data. */
    @NotNull
    @JsonDeserialize(using = ByteArrayDeserializer.class)
    @Column(name = "file_binary_data", length = AppConstants.MAX_FILE_SIZE, nullable = false)
    private byte[] binaryData;
    /** MIME type. */
    @NotNull
    @Column(name = "mime_type", length = AppConstants.SIMPLE_TEXT_SIZE, nullable = false)
    private String mimeType;
    /** Owner entity ID. */
    @NotNull
    @Column(name = "owner_id", nullable = false)
    private Long ownerId;
    /** Owner entity class. */
    @NotNull
    @Size(max = AppConstants.SIMPLE_TEXT_SIZE)
    @Column(name = "owner_class", nullable = false, length = AppConstants.SIMPLE_TEXT_SIZE)
    private String ownerClass;
    /** Type. */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "file_type", nullable = false)
    private EntityFileType type;
// ============================================= SET & GET ============================================================
    /**
     * @return the binaryData
     */
    public byte[] getBinaryData() {
        return binaryData;
    }
    /**
     * @param binaryData the binaryData to set
     */
    public void setBinaryData(byte[] binaryData) {
        this.binaryData = binaryData;
    }
    /**
     * @return the mimeType
     */
    public String getMimeType() {
        return mimeType;
    }
    /**
     * @param mimeType the mimeType to set
     */
    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }
    /**
     * @return the ownerId
     */
    public Long getOwnerId() {
        return ownerId;
    }
    /**
     * @param ownerId the ownerId to set
     */
    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }
    /**
     * @return the ownerClass
     */
    public String getOwnerClass() {
        return ownerClass;
    }
    /**
     * @param ownerClass the ownerClass to set
     */
    public void setOwnerClass(String ownerClass) {
        this.ownerClass = ownerClass;
    }
    /**
     * @return the type
     */
    public EntityFileType getType() {
        return type;
    }
    /**
     * @param type the type to set
     */
    public void setType(EntityFileType type) {
        this.type = type;
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
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof EntityFile)) {
            return false;
        }
        EntityFile other = (EntityFile) object;
        return !((this.getId() == null && other.getId() != null)
                || (this.getId() != null && !this.getId().equals(other.getId())));
    }
    @Override
    public String toString() {
        return "ss.martin.platform.entity.EntityFile[ id=" + getId() + " ]";
    }
}
