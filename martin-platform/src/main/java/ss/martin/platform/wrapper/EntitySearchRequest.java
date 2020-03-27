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
package ss.martin.platform.wrapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import ss.martin.platform.constants.JPABoolConditionOperator;
import ss.martin.platform.constants.JPAComparisonOperator;

/**
 * Entity search request.
 * @author ss
 */
public class EntitySearchRequest {
    /** Default limit for SQL requests. */
    private static final int DEFAULT_LIMIT = 10000;
    // =========================================== FIELDS =============================================================
    /** Page number. Required. */
    private Integer page;
    /** Page size. Required. */
    private Integer pageSize;
    /** Order, asc, desc. */
    private String order;
    /** Order by field. */
    private String orderBy;
    /** Filter parameters, key is field name, value is field value. */
    private List<FilterCondition> filter;
    /** Ignore count request. Required for optimization. */
    private boolean ignoreCount;
    // =========================================== CONSTRUCTORS =======================================================
    /**
     * Constructor.
     */
    public EntitySearchRequest() {
    }
    /**
     * Constructor.
     * @param limit limit result.
     */
    public EntitySearchRequest(int limit) {
        this.pageSize = limit;
        this.page = 1;
    }
    // =========================================== ACTIONS ============================================================
    /**
     * Create new request.
     * @return new search request.
     */
    public static EntitySearchRequest createRequest() {
        EntitySearchRequest request = new EntitySearchRequest();
        request.setPage(1);
        request.setPageSize(DEFAULT_LIMIT);
        request.setFilter(new ArrayList<>());
        request.setIgnoreCount(true);
        return request;
    }
    /**
     * Add filter.
     * @param predicates filter predicates.
     * @param operator filter operator.
     * @return search request.
     */
    public EntitySearchRequest addFilter(FilterPredicate[] predicates, JPABoolConditionOperator operator) {
        FilterCondition condition = new FilterCondition();
        condition.setOperator(JPABoolConditionOperator.OR);
        condition.setPredicates(Arrays.asList(predicates));
        this.getFilter().add(condition);
        return this;
    }
    // =========================================== SET & GET ==========================================================
    /**
     * @return the page
     */
    public Integer getPage() {
        return page;
    }
    /**
     * @param page the page to set
     */
    public void setPage(Integer page) {
        this.page = page;
    }
    /**
     * @return the pageSize
     */
    public Integer getPageSize() {
        return pageSize;
    }
    /**
     * @param pageSize the pageSize to set
     */
    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
    /**
     * @return the order
     */
    public String getOrder() {
        return order;
    }
    /**
     * @param order the order to set
     */
    public void setOrder(String order) {
        this.order = order;
    }
    /**
     * @return the orderBy
     */
    public String getOrderBy() {
        return orderBy;
    }
    /**
     * @param orderBy the orderBy to set
     */
    public void setOrderBy(String orderBy) {
        this.orderBy = orderBy;
    }
    /**
     * @return the filter
     */
    public List<FilterCondition> getFilter() {
        return filter;
    }
    /**
     * @param filter the filter to set
     */
    public void setFilter(List<FilterCondition> filter) {
        this.filter = filter;
    }
    /**
     * @return the ignoreCount
     */
    public boolean isIgnoreCount() {
        return ignoreCount;
    }
    /**
     * @param ignoreCount the ignoreCount to set
     */
    public void setIgnoreCount(boolean ignoreCount) {
        this.ignoreCount = ignoreCount;
    }
    /**
     * Filter condition.
     * Contains predicates / inner conditions which are combined by common boolean operator.
     */
    public static class FilterCondition {
        /** Predicates. */
        private List<FilterPredicate> predicates;
        /** Inner conditions. */
        private List<FilterCondition> conditions;
        /** Operator. */
        private JPABoolConditionOperator operator;
        /**
         * @return the predicates
         */
        public List<FilterPredicate> getPredicates() {
            return predicates;
        }
        /**
         * @param predicates the predicates to set
         */
        public void setPredicates(List<FilterPredicate> predicates) {
            this.predicates = predicates;
        }
        /**
         * @return the operator
         */
        public JPABoolConditionOperator getOperator() {
            return operator;
        }
        /**
         * @param operator the operator to set
         */
        public void setOperator(JPABoolConditionOperator operator) {
            this.operator = operator;
        }
        /**
         * @return the conditions
         */
        public List<FilterCondition> getConditions() {
            return conditions;
        }
        /**
         * @param conditions the conditions to set
         */
        public void setConditions(List<FilterCondition> conditions) {
            this.conditions = conditions;
        }
    }
    /**
     * Filter predicate, pair field name-value plus operator for comparison.
     */
    public static class FilterPredicate {
        /** Field name. */
        private String field;
        /** Value */
        private Object value;
        /** Operator. */
        private JPAComparisonOperator operator;
        /**
         * Constructor.
         */
        public FilterPredicate() {
        }
        /**
         * Constructor.
         * @param field field.
         * @param operator operator.
         * @param value value.
         */
        public FilterPredicate(String field, JPAComparisonOperator operator, Object value) {
            this.field = field;
            this.operator = operator;
            this.value= value;
        }
        /**
         * @return the field
         */
        public String getField() {
            return field;
        }
        /**
         * @param field the field to set
         */
        public void setField(String field) {
            this.field = field;
        }
        /**
         * @return the value
         */
        public Object getValue() {
            return value;
        }
        /**
         * @param value the value to set
         */
        public void setValue(Object value) {
            this.value = value;
        }
        /**
         * @return the operator
         */
        public JPAComparisonOperator getOperator() {
            return operator;
        }
        /**
         * @param operator the operator to set
         */
        public void setOperator(JPAComparisonOperator operator) {
            this.operator = operator;
        }
    }
}
