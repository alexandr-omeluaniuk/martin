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
package ss.martin.platform.dao.impl;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import ss.martin.platform.dao.CoreDAO;
import ss.martin.platform.dao.EntityFileDAO;
import ss.martin.platform.entity.DataModel;
import ss.martin.platform.entity.EntityFile;
import ss.martin.platform.entity.HasAvatar;

/**
 * Entity file DAO implementation.
 * @author ss
 */
@Repository
class EntityFileDAOImpl implements EntityFileDAO {
    /** Entity manager. */
    @PersistenceContext
    private EntityManager em;
    /** Core DAO. */
    @Autowired
    private CoreDAO coreDAO;
    @Override
    @Transactional(propagation = Propagation.REQUIRED)
    public EntityFile getAvatar(Long ownerId, Class<? extends HasAvatar> clazz) throws Exception {
        DataModel entity = coreDAO.findById(ownerId, (Class<? extends DataModel>) clazz);
        HasAvatar entityWithAvatar = (HasAvatar) entity;
        EntityFile avatar = entityWithAvatar.getAvatar();
        System.out.println(avatar);
        return avatar;
    }
}
