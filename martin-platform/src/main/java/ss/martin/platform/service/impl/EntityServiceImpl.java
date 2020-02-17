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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import ss.martin.platform.anno.ui.FormField;
import ss.martin.platform.dao.CoreDAO;
import ss.martin.platform.entity.DataModel;
import ss.martin.platform.entity.Subscription;
import ss.martin.platform.entity.SystemUser;
import ss.martin.platform.service.EntityService;
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
    /** Logger. */
    private static final Logger LOG = LoggerFactory.getLogger(EntityService.class);
    /** Core DAO. */
    @Autowired
    private CoreDAO coreDAO;
    /** Subscription service. */
    @Autowired
    private SubscriptionService subscriptionService;
    /** System user service. */
    @Autowired
    private SystemUserService systemUserService;
    @Override
    public EntitySearchResponse searchEntities(final Class<? extends DataModel> clazz,
            final EntitySearchRequest searchRequest) throws Exception {
        return coreDAO.searchEntities(clazz, searchRequest);
    }
    @Override
    public <T extends DataModel> T createEntity(T entity) throws Exception {
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
        Class<T> entityClass = (Class<T>) entity.getClass();
        T fromDB = coreDAO.findById(entity.getId(), entityClass);
        setUpdatableFields(entityClass, fromDB, entity);
        return coreDAO.update(fromDB);
    }
    @Override
    public <T extends DataModel> void massDeleteEntities(Set<Long> ids, Class<T> cl) throws Exception {
        coreDAO.massDelete(ids, cl);
    }
    @Override
    public <T extends DataModel> T findEntityByID(Long id, Class<T> cl) throws Exception {
        return coreDAO.findById(id, cl);
    }
    @Override
    public <T extends DataModel> List getDataForCollectionField(Class<T> cl, String fieldName) throws Exception {
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
