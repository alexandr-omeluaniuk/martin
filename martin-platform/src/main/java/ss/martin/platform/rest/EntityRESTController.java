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
package ss.martin.platform.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.Serializable;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import ss.martin.platform.constants.AppURLs;
import ss.martin.platform.entity.DataModel;
import ss.martin.platform.entity.EntityFile;
import ss.martin.platform.entity.HasAvatar;
import ss.martin.platform.service.EntityMetadataService;
import ss.martin.platform.service.EntityService;
import ss.martin.platform.wrapper.DataModelWrapper;
import ss.martin.platform.wrapper.EntitySearchRequest;
import ss.martin.platform.wrapper.EntitySearchResponse;
import ss.martin.platform.wrapper.RESTResponse;

/**
 * Entity REST controller.
 * @author ss
 */
@RestController
@RequestMapping(AppURLs.APP_CRM_REST_API + "/entity")
public class EntityRESTController {
    /** Entity service. */
    @Autowired
    private EntityService entityService;
    /** Entity metadata service. */
    @Autowired
    private EntityMetadataService entityMetadataService;
    /**
     * Search entities.
     * @param entityName entity name.
     * @param searchRequest search request.
     * @return search response.
     * @throws Exception error.
     */
    @RequestMapping(value = "/search/{entity}", method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public EntitySearchResponse searchEntities(@PathVariable("entity") String entityName,
            @RequestBody EntitySearchRequest searchRequest) throws Exception {
        Class entityClass = (Class<? extends Serializable>) Class.forName(entityName);
        return entityService.searchEntities(entityClass, searchRequest);
    }
    /**
     * Get entity by ID.
     * @param entityName entity name.
     * @param id entity ID.
     * @return entity.
     * @throws Exception error.
     */
    @RequestMapping(value = "/{entity}/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public DataModelWrapper getEntityById(@PathVariable("entity") String entityName,
            @PathVariable("id") Long id) throws Exception {
        Class entityClass = (Class<? extends Serializable>) Class.forName(entityName);
        DataModelWrapper wrapper = new DataModelWrapper();
        wrapper.setLayout(entityMetadataService.getEntityLayout(entityClass));
        wrapper.setListView(entityMetadataService.getEntityListView(entityClass));
        if (id > 0) {
            wrapper.setData(entityService.findEntityByID(id, entityClass));
        }
        return wrapper;
    }
    /**
     * Create entity.
     * @param entityName entity name.
     * @param rawData raw data.
     * @return entity with ID.
     * @throws Exception error.
     */
    @RequestMapping(value = "/{entity}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public Object createEntity(@PathVariable("entity") String entityName, @RequestBody Object rawData)
            throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        Class entityClass = (Class<? extends Serializable>) Class.forName(entityName);
        DataModel entity = (DataModel) mapper.convertValue(rawData, entityClass);
        return entityService.createEntity(entity);
    }
    /**
     * Update entity.
     * @param entityName entity name.
     * @param rawData raw data.
     * @return empty response.
     * @throws Exception error.
     */
    @RequestMapping(value = "/{entity}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public RESTResponse updateEntity(@PathVariable("entity") String entityName, @RequestBody Object rawData)
            throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        Class entityClass = (Class<? extends Serializable>) Class.forName(entityName);
        DataModel entity = (DataModel) mapper.convertValue(rawData, entityClass);
        entityService.updateEntity(entity);
        return new RESTResponse();
    }
    /**
     * Mass deletion.
     * @param entityName entity name.
     * @param ids set of IDs.
     * @return response.
     * @throws Exception error.
     */
    @RequestMapping(value = "/delete/{entity}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public RESTResponse deleteEntities(@PathVariable("entity") String entityName, @RequestBody Set<Long> ids)
            throws Exception {
        Class entityClass = (Class<? extends Serializable>) Class.forName(entityName);
        entityService.massDeleteEntities(ids, entityClass);
        return new RESTResponse();
    }
    /**
     * Get data for entity collection field.
     * @param entityName entity name.
     * @param field field name.
     * @return data.
     * @throws Exception error.
     */
    @RequestMapping(value = "/collection/{entity}/{field}", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public List getDataForCollectionField(@PathVariable("entity") String entityName,
            @PathVariable("field") String field) throws Exception {
        Class entityClass = (Class<? extends Serializable>) Class.forName(entityName);
        return entityService.getDataForCollectionField(entityClass, field);
    }
    /**
     * Get entity avatar.
     * @param cl entity class.
     * @param id entity ID.
     * @return entity avatar or empty value
     * @throws Exception error.
     */
    @RequestMapping(value = "/avatar/{class}/{id}", method = RequestMethod.GET,
            produces = MediaType.IMAGE_JPEG_VALUE)
    public byte[] getAvatar(@PathVariable("class") Class<? extends HasAvatar> cl, @PathVariable("id") Long id)
            throws Exception {
        EntityFile avatar = entityService.getEntityAvatar(id, cl);
        return avatar == null ? new byte[0] : avatar.getBinaryData();
    }
    /**
     * Deactivate entity.
     * @param entityName entity class.
     * @param id entity ID.
     * @return empty response.
     * @throws Exception error.
     */
    @RequestMapping(value = "/deactivate/{entity}/{id}", method = RequestMethod.PUT, 
            produces = MediaType.APPLICATION_JSON_VALUE)
    public RESTResponse deactivateEntities(@PathVariable("entity") String entityName, @PathVariable("id") Long id)
            throws Exception {
        Class entityClass = (Class<? extends Serializable>) Class.forName(entityName);
        entityService.deactivateEntity(id, entityClass);
        return new RESTResponse();
    }
}
