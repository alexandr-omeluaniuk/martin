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

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import ss.martin.platform.constants.JPABoolConditionOperator;
import ss.martin.platform.constants.JPAComparisonOperator;
import ss.martin.platform.dao.CoreDAO;
import ss.martin.platform.entity.CalendarEvent;
import ss.martin.platform.entity.CalendarEvent_;
import ss.martin.platform.service.CalendarService;
import ss.martin.platform.wrapper.CalendarSearchRequest;
import ss.martin.platform.wrapper.EntitySearchRequest;

/**
 * Calendar service implementation.
 * @author ss
 */
@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
class CalendarServiceImpl implements CalendarService {
    /** Core DAO. */
    @Autowired
    private CoreDAO coreDAO;
    @Override
    public List<CalendarEvent> search(CalendarSearchRequest searchRequest) throws Exception {
        List<CalendarEvent> result = new ArrayList<>();
        for (Class<? extends CalendarEvent> cl : searchRequest.getClasses()) {
            EntitySearchRequest entitySearchRequest = EntitySearchRequest.createRequest()
                    .addFilter(new EntitySearchRequest.FilterPredicate[] {
                        new EntitySearchRequest.FilterPredicate(CalendarEvent_.START,
                                JPAComparisonOperator.GREATER_THAN_OR_EQUAL_TO, searchRequest.getFrom()),
                        new EntitySearchRequest.FilterPredicate(CalendarEvent_.END,
                                JPAComparisonOperator.LESS_THAN_OR_EQUAL_TO, searchRequest.getFrom())
                    }, JPABoolConditionOperator.AND);
            result.addAll(coreDAO.searchEntities(cl, entitySearchRequest).getData());
        };
        return result;
    }
}
