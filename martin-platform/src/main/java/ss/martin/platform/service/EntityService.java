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
package ss.martin.platform.service;

import java.util.List;
import java.util.Set;
import ss.martin.platform.entity.DataModel;
import ss.martin.platform.entity.EntityFile;
import ss.martin.platform.entity.HasAvatar;
import ss.martin.platform.entity.Undeletable;
import ss.martin.platform.wrapper.EntitySearchRequest;
import ss.martin.platform.wrapper.EntitySearchResponse;

/**
 * Entity service.
 * @author ss
 */
public interface EntityService {
    /**
     * Search entities.
     * @param clazz entity class.
     * @param searchRequest search request.
     * @return search response.
     * @throws Exception error.
     */
    EntitySearchResponse searchEntities(Class<? extends DataModel> clazz, EntitySearchRequest searchRequest)
            throws Exception;
    /**
     * Create entity.
     * @param <T> entity type.
     * @param entity entity.
     * @return entity.
     * @throws Exception error.
     */
    <T extends DataModel> T createEntity(T entity) throws Exception;
    /**
     * Update entity.
     * @param <T> entity type.
     * @param entity entity.
     * @return updated entity.
     * @throws Exception error.
     */
    <T extends DataModel> T updateEntity(T entity) throws Exception;
    /**
     * Mass deletion.
     * @param <T> entity type.
     * @param ids set of IDs.
     * @param cl entity class.
     * @throws Exception error.
     */
    <T extends DataModel> void massDeleteEntities(Set<Long> ids, Class<T> cl) throws Exception;
    /**
     * Find entity by ID.
     * @param <T> entity type.
     * @param id entity ID.
     * @param cl entity class.
     * @return entity.
     * @throws Exception error.
     */
    <T extends DataModel> T findEntityByID(Long id, Class<T> cl) throws Exception;
    /**
     * Get data for entity collection field.
     * @param <T> entity type.
     * @param cl entity class.
     * @param fieldName field name.
     * @return list of possible data for entity field.
     * @throws Exception error.
     */
    <T extends DataModel> List getDataForCollectionField(Class<T> cl, String fieldName) throws Exception;
    /**
     * Get entity avatar.
     * @param id entity ID.
     * @param cl entity class.
     * @return entity avatar.
     * @throws Exception error.
     */
    EntityFile getEntityAvatar(Long id, Class<? extends HasAvatar> cl) throws Exception;
    /**
     * Deactivate entity.
     * @param <T> undeletable entity.
     * @param id entity ID.
     * @param cl entity class.
     * @throws Exception error.
     */
    <T extends DataModel & Undeletable> void deactivateEntity(Long id, Class<T> cl) throws Exception;
}
