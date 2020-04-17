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
package ss.martin.platform.entity.listener;

import java.util.Optional;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;
import ss.martin.platform.constants.EntityFileType;
import ss.martin.platform.entity.DataModel;
import ss.martin.platform.entity.HasAvatar;
import ss.martin.platform.security.SecurityContext;

/**
 * Avatar entity listener.
 * @author ss
 */
public class HasAvatarListener {
    @Autowired
    private SecurityContext securityContext;
    @PrePersist
    @PreUpdate
    protected void prePersistAndUpdate(HasAvatar entity) throws Exception {
        SpringBeanAutowiringSupport.processInjectionBasedOnCurrentContext(this);
        entity.setHasAvatar(entity.getAvatar() != null);
        Optional.ofNullable(entity.getAvatar()).ifPresent((file) -> {
            file.setOwnerId(((DataModel) entity).getId());
            file.setType(EntityFileType.AVATAR);
            file.setOwnerClass(entity.getClass().getName());
            file.setSubscription(securityContext.currentUser().getSubscription());
        });
    }
}
