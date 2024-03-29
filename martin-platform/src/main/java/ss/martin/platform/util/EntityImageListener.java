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
package ss.martin.platform.util;

import javax.persistence.PrePersist;
import javax.persistence.PreRemove;
import javax.persistence.PreUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import ss.entity.martin.EntityImage;
import ss.martin.platform.service.ImageService;

/**
 * Entity image listener.
 * @author alex
 */
public class EntityImageListener {
    /** Image service. */
    private ImageService imageService;
    
    @Autowired
    public void init(ImageService imageService) {
        this.imageService = imageService;
    }
    
    @PrePersist
    protected void prePersist(EntityImage entity) throws Exception {
        entity.setFileNameOnDisk(imageService.saveImageToDisk(entity.getData()));
        entity.setData(new byte[0]);  // release space in DB
    }
    
    @PreUpdate
    protected void preUpdate(EntityImage entity) throws Exception {
        imageService.deleteImageFromDisk(entity);
        entity.setFileNameOnDisk(imageService.saveImageToDisk(entity.getData()));
        entity.setData(new byte[0]);  // release space in DB
    }
    
    @PreRemove
    protected void preRemove(EntityImage entity) throws Exception {
        imageService.deleteImageFromDisk(entity);
    }
}
