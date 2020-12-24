/*
 * Copyright (C) 2018 Wisent Media
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package ss.martin.platform.dao.impl;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import ss.martin.platform.dao.UserDAO;
import ss.martin.platform.entity.SystemUser;
import ss.martin.platform.entity.SystemUser_;
import ss.martin.platform.security.StandardRole;

/**
 * SystemUser DAO implementation.
 * @author Alexandr Omeluaniuk
 */
@Repository
class UserDAOImpl implements UserDAO {
    /** Entity manager. */
    @PersistenceContext
    private EntityManager em;
    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public SystemUser findByUsername(String username) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<SystemUser> criteria = cb.createQuery(SystemUser.class);
        Root<SystemUser> c = criteria.from(SystemUser.class);
        c.fetch(SystemUser_.subscription);
        criteria.select(c).where(cb.equal(c.get(SystemUser_.email), username));
        List<SystemUser> users = em.createQuery(criteria).getResultList();
        return users.isEmpty() ? null : users.get(0);
    }
    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public SystemUser getSuperUser() {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<SystemUser> criteria = cb.createQuery(SystemUser.class);
        Root<SystemUser> c = criteria.from(SystemUser.class);
        criteria.select(c).where(cb.equal(c.get(SystemUser_.standardRole), StandardRole.ROLE_SUPER_ADMIN));
        List<SystemUser> users = em.createQuery(criteria).getResultList();
        return users.isEmpty() ? null : users.get(0);
    }
    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public SystemUser getUserByValidationString(String validationString) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<SystemUser> criteria = cb.createQuery(SystemUser.class);
        Root<SystemUser> c = criteria.from(SystemUser.class);
        criteria.select(c).where(cb.equal(c.get(SystemUser_.validationString), validationString));
        List<SystemUser> users = em.createQuery(criteria).getResultList();
        return users.isEmpty() ? null : users.get(0);
    }
}
