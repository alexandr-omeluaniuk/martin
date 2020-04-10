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
package ss.martin.platform.service.impl;

import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import ss.martin.platform.anno.ui.FormField;
import ss.martin.platform.constants.EntityPermission;
import ss.martin.platform.dao.CoreDAO;
import ss.martin.platform.dao.EntityFileDAO;
import ss.martin.platform.entity.DataModel;
import ss.martin.platform.entity.EntityFile;
import ss.martin.platform.entity.HasAvatar;
import ss.martin.platform.entity.Subscription;
import ss.martin.platform.entity.SystemUser;
import ss.martin.platform.entity.Undeletable;
import ss.martin.platform.exception.PlatformException;
import ss.martin.platform.exception.PlatformSecurityException;
import ss.martin.platform.service.EntityService;
import ss.martin.platform.service.SecurityService;
import ss.martin.platform.service.SubscriptionService;
import ss.martin.platform.service.SystemUserService;
import ss.martin.platform.wrapper.EntitySearchRequest;
import ss.martin.platform.wrapper.EntitySearchResponse;

/**
 * Entity service implementation.
 * @author ss
 */
@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
class EntityServiceImpl implements EntityService {
    /** Core DAO. */
    @Autowired
    private CoreDAO coreDAO;
    /** Entity file DAO. */
    @Autowired
    private EntityFileDAO entityFileDAO;
    /** Subscription service. */
    @Autowired
    private SubscriptionService subscriptionService;
    /** System user service. */
    @Autowired
    private SystemUserService systemUserService;
    /** Security service. */
    @Autowired
    private SecurityService securityService;
    @Override
    public EntitySearchResponse searchEntities(Class<? extends DataModel> clazz,
            EntitySearchRequest searchRequest) throws Exception {
        if (!securityService.getEntityPermissions(clazz).contains(EntityPermission.READ)) {
            throw new PlatformSecurityException(EntityPermission.READ, clazz);
        }
        return coreDAO.searchEntities(clazz, searchRequest);
    }
    @Override
    public <T extends DataModel> T createEntity(T entity) throws Exception {
        if (!securityService.getEntityPermissions(entity.getClass()).contains(EntityPermission.CREATE)) {
            throw new PlatformSecurityException(EntityPermission.CREATE, entity.getClass());
        }
        if (Undeletable.class.isAssignableFrom(entity.getClass())) {
            ((Undeletable) entity).setActive(true);
        }
        if (entity instanceof Subscription) {
            return (T) subscriptionService.createSubscription((Subscription) entity);
        } else if (entity instanceof SystemUser) {
            return (T) systemUserService.createSystemUser((SystemUser) entity);
        } else {
            return coreDAO.create(entity);
        }
    }
    @Override
    public <T extends DataModel> T updateEntity(T entity) throws Exception {
        if (!securityService.getEntityPermissions(entity.getClass()).contains(EntityPermission.UPDATE)) {
            throw new PlatformSecurityException(EntityPermission.UPDATE, entity.getClass());
        }
        Class<T> entityClass = (Class<T>) entity.getClass();
        T fromDB = coreDAO.findById(entity.getId(), entityClass);
        setUpdatableFields(entityClass, fromDB, entity);
        return coreDAO.update(fromDB);
    }
    @Override
    public <T extends DataModel> void deleteEntities(Set<Long> ids, Class<T> cl) throws Exception {
        if (!securityService.getEntityPermissions(cl).contains(EntityPermission.DELETE)) {
            throw new PlatformSecurityException(EntityPermission.DELETE, cl);
        }
        if (Undeletable.class.isAssignableFrom(cl)) {
            throw new PlatformException("Attempt to delete undeletable entity: " + cl.getName());
        }
        coreDAO.massDelete(ids, cl);
    }
    @Override
    public <T extends DataModel & Undeletable> void deactivateEntities(Set<Long> ids, Class<T> cl) throws Exception {
        if (!securityService.getEntityPermissions(cl).contains(EntityPermission.DELETE)) {
            throw new PlatformSecurityException(EntityPermission.DELETE, cl);
        }
        coreDAO.deactivateEntities(ids, cl);
    }
    @Override
    public <T extends DataModel & Undeletable> void activateEntities(Set<Long> ids, Class<T> cl) throws Exception {
        if (!securityService.getEntityPermissions(cl).contains(EntityPermission.UPDATE)) {
            throw new PlatformSecurityException(EntityPermission.UPDATE, cl);
        }
        coreDAO.activateEntities(ids, cl);
    }
    @Override
    public <T extends DataModel> T findEntityByID(Long id, Class<T> cl) throws Exception {
        if (!securityService.getEntityPermissions(cl).contains(EntityPermission.READ)) {
            throw new PlatformSecurityException(EntityPermission.READ, cl);
        }
        return coreDAO.findById(id, cl);
    }
    @Override
    public <T extends DataModel> List getDataForCollectionField(Class<T> cl, String fieldName) throws Exception {
        if (!securityService.getEntityPermissions(cl).contains(EntityPermission.READ)) {
            throw new PlatformSecurityException(EntityPermission.READ, cl);
        }
        List result = new ArrayList();
        Field field = cl.getDeclaredField(fieldName);
        Optional<Type> genericTypes = Optional.ofNullable(field).map(Field::getGenericType);
        genericTypes.ifPresent((gt) -> {
            if (gt instanceof ParameterizedType) {
                ParameterizedType parType = (ParameterizedType) gt;
                Class<?> genericClass = (Class<?>) parType.getActualTypeArguments()[0];
                if (genericClass.isEnum()) {
                    result.addAll(Arrays.asList(genericClass.getEnumConstants()));
                }
            }
        });
        return result;
    }
    @Override
    public EntityFile getEntityAvatar(Long id, Class<? extends HasAvatar> cl) throws Exception {
        if (!securityService.getEntityPermissions((Class<? extends DataModel>) cl).contains(EntityPermission.READ)) {
            throw new PlatformSecurityException(EntityPermission.READ, (Class<? extends DataModel>) cl);
        }
        return entityFileDAO.getAvatar(id, cl);
    }
    // ==================================== PRIVATE ===================================================================
    /**
     * Set values for updatable fields.
     * @param entityClass entity class.
     * @param fromDB entity from database.
     * @param fromUser entity from user.
     * @throws Exception error.
     */
    private void setUpdatableFields(Class entityClass, Object fromDB, Object fromUser) throws Exception {
        for (Field field : entityClass.getDeclaredFields()) {
            FormField formField = field.getAnnotation(FormField.class);
            if (formField != null) {    // field is updatable
                field.setAccessible(true);
                field.set(fromDB, field.get(fromUser));
                field.setAccessible(false);
            }
        }
        if (entityClass.getSuperclass() != null) {
            setUpdatableFields(entityClass.getSuperclass(), fromDB, fromUser);
        }
    }
}
