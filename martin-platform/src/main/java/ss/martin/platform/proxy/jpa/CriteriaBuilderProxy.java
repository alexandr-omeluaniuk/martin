/*
 * The MIT License
 *
 * Copyright 2019 ss.
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
package ss.martin.platform.proxy.jpa;

import java.lang.reflect.Method;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaDelete;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.CriteriaUpdate;
import ss.martin.platform.proxy.AbstractProxy;

/**
 * Proxy for criteria builder.
 * @author ss
 */
public class CriteriaBuilderProxy extends AbstractProxy<CriteriaBuilder> {
    @Override
    public Object doInvoke(Object proxy, Method method, Object[] args) throws Throwable {
        if ("createCriteriaDelete".equals(method.getName())) {
            CriteriaDelete criteria = (CriteriaDelete) method.invoke(origin, args);
            return new CriteriaDeleteProxy().proxying(criteria, CriteriaDelete.class);
        } else if ("createCriteriaUpdate".equals(method.getName())) {
            CriteriaUpdate criteria = (CriteriaUpdate) method.invoke(origin, args);
            return new CriteriaUpdateProxy().proxying(criteria, CriteriaUpdate.class);
        } else if ("createQuery".equals(method.getName()) && args.length == 1) {
            CriteriaQuery criteria = (CriteriaQuery) method.invoke(origin, args);
            return new CriteriaQueryProxy().proxying(criteria, CriteriaQuery.class);
        } else {
            return method.invoke(origin, args);
        }
    }
}
