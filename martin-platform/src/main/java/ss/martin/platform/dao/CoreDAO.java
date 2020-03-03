/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ss.martin.platform.dao;

import java.io.Serializable;
import java.util.Set;
import ss.martin.platform.entity.DataModel;
import ss.martin.platform.wrapper.EntitySearchRequest;
import ss.martin.platform.wrapper.EntitySearchResponse;

/**
 * Core DAO API.
 * @author Alexandr Omeluaniuk
 */
public interface CoreDAO {
    /**
     * Create entity ignore subscription.
     * @param <T> entity class.
     * @param entity entity.
     * @return created entity.
     */
    <T extends DataModel> T createIgnoreSubscription(T entity);
    /**
     * Create entity (subscription will be assigned automatically).
     * @param <T> entity class.
     * @param entity entity.
     * @return created entity.
     * @throws Exception error.
     */
    <T extends DataModel> T create(T entity) throws Exception;
    /**
     * Update entity (subscription will be assigned automatically).
     * @param <T> entity class.
     * @param entity entity.
     * @return updated entity.
     * @throws Exception error.
     */
    <T extends DataModel> T update(T entity) throws Exception;
    /**
     * Find entity by ID.
     * @param <T> entity type.
     * @param id entity ID.
     * @param cl entity class.
     * @return entity.
     */
    <T extends DataModel> T findById(Serializable id, Class<T> cl);
    /**
     * Delete entity.
     * @param <T> entity type.
     * @param id entity ID.
     * @param cl entity class.
     */
    <T extends DataModel> void delete(Serializable id, Class<T> cl);
    /**
     * Mass deletion.
     * @param <T> entity type.
     * @param ids set of IDs.
     * @param cl entity class.
     */
    <T extends DataModel> void massDelete(Set<Long> ids, Class<T> cl);
    /**
     * Search entities.
     * @param <T> entity type.
     * @param cl entity class.
     * @param searchRequest search request.
     * @return search response.
     * @throws Exception error.
     */
    <T extends DataModel> EntitySearchResponse searchEntities(Class<T> cl, EntitySearchRequest searchRequest)
            throws Exception;
}
