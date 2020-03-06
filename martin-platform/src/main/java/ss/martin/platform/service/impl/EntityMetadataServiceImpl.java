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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ss.martin.platform.anno.ui.Avatar;
import ss.martin.platform.anno.ui.CardSubTitle;
import ss.martin.platform.anno.ui.CardTitle;
import ss.martin.platform.anno.ui.FormField;
import ss.martin.platform.anno.ui.ListViewColumn;
import ss.martin.platform.anno.ui.MaterialIcon;
import ss.martin.platform.anno.validation.MobilePhoneNumber;
import ss.martin.platform.constants.DataType;
import ss.martin.platform.constants.RepresentationComponentSource;
import ss.martin.platform.constants.RepresentationComponentType;
import ss.martin.platform.entity.CalendarEvent;
import ss.martin.platform.entity.DataModel;
import ss.martin.platform.entity.EntityAudit;
import ss.martin.platform.service.EntityMetadataService;
import ss.martin.platform.service.ReflectionUtils;
import ss.martin.platform.ui.CalendarView;
import ss.martin.platform.ui.Layout;
import ss.martin.platform.ui.ListView;
import ss.martin.platform.anno.ui.EntityCollection;
import ss.martin.platform.anno.ui.FilterCondition;
import ss.martin.platform.anno.ui.FilterPredicate;
import ss.martin.platform.anno.ui.LookupField;
import ss.martin.platform.anno.ui.TextArea;
import static ss.martin.platform.constants.DataType.ENTITY_COLLECTION;
import ss.martin.platform.constants.DataTypeAttribute;
import ss.martin.platform.wrapper.EntitySearchRequest;

/**
 * Entity metadata service implementation.
 * @author ss
 */
@Service
class EntityMetadataServiceImpl implements EntityMetadataService {
    /** Logger. */
    private static final Logger LOG = LoggerFactory.getLogger(EntityMetadataService.class);
    /** Layouts cache. */
    private static final Map<Class<? extends DataModel>, Layout> LAYOUTS_CACHE = new ConcurrentHashMap<>();
    /** Excluded fields. */
    private static final Set<String> EXCLUDED_FIELDS = new HashSet<>();
    /** Reflection utilities. */
    @Autowired
    private ReflectionUtils reflectionUtils;
    /**
     * Static initialization.
     */
    static {
        EXCLUDED_FIELDS.add("serialVersionUID");
    }
    @Override
    public Layout getEntityLayout(Class<? extends DataModel> clazz) throws Exception {
        if (LAYOUTS_CACHE.containsKey(clazz)) {
            return LAYOUTS_CACHE.get(clazz);
        }
        LOG.debug("get entity layout [" + clazz.getSimpleName() + "]");
        Layout layout = new Layout();
        layout.setFields(new ArrayList<>());
        layout.setAudit(reflectionUtils.hasSuperClass(clazz, EntityAudit.class));
        for (Field field : getClassFields(clazz)) {
            if (!EXCLUDED_FIELDS.contains(field.getName())) {
                layout.getFields().add(createEntityLayoutField(field));
                Optional.ofNullable(field.getAnnotation(CardTitle.class)).ifPresent((a) -> {
                    layout.setCardTitle(field.getName());
                });
                Optional.ofNullable(field.getAnnotation(CardSubTitle.class)).ifPresent((a) -> {
                    layout.setCardSubTitle(field.getName());
                });
            }
        }
        LAYOUTS_CACHE.put(clazz, layout);
        return layout;
    }
    @Override
    public ListView getEntityListView(Class<? extends DataModel> clazz) throws Exception {
        ListView component = new ListView();
        component.setSource(RepresentationComponentSource.ENTITY);
        component.setListViewColumns(new ArrayList());
        component.setClassName(clazz.getName());
        component.setAudit(reflectionUtils.hasSuperClass(clazz, EntityAudit.class));
        Optional.ofNullable(clazz.getAnnotation(MaterialIcon.class)).ifPresent((anno) -> {
            component.setIcon(anno.icon());
        });
        for (Field field : clazz.getDeclaredFields()) {
            ListViewColumn listViewColumnAnno = field.getAnnotation(ListViewColumn.class);
            if (listViewColumnAnno != null) {
                ListView.ListViewColumn listViewColumn = new ListView.ListViewColumn();
                listViewColumn.setId(field.getName());
                listViewColumn.setAlign(listViewColumnAnno.align());
                listViewColumn.setLayoutField(createEntityLayoutField(field));
                listViewColumn.setLink(listViewColumnAnno.link());
                listViewColumn.setSortable(listViewColumnAnno.sortable());
                component.getListViewColumns().add(listViewColumn);
            }
        }
        return component;
    }
    @Override
    public CalendarView getEntityCalendarView(Class<? extends CalendarEvent> clazz) throws Exception {
        CalendarView component = new CalendarView();
        component.setClassName(clazz.getName());
        component.setSource(RepresentationComponentSource.ENTITY);
        Optional.ofNullable(clazz.getAnnotation(MaterialIcon.class)).ifPresent((anno) -> {
            component.setIcon(anno.icon());
        });
        return component;
    }
    // =================================================== PRIVATE ====================================================
    /**
     * Create entity layout field from entity field.
     * @param field entity field.
     * @param entityClass entity class.
     * @return layout field.
     * @throws Exception error.
     */
    private Layout.Field createEntityLayoutField(Field field) throws Exception {
        Layout.Field layoutField = new Layout.Field();
        defineDataType(field, layoutField);
        layoutField.setName(field.getName());
        layoutField.setFieldType(field.getType().getName());
        Optional.ofNullable(field.getAnnotation(FormField.class)).ifPresent((grid) -> {
            Layout.Grid fieldGridSystem = new Layout.Grid();
            fieldGridSystem.setLg(grid.lg());
            fieldGridSystem.setMd(grid.lg());
            fieldGridSystem.setSm(grid.sm());
            fieldGridSystem.setXs(grid.xs());
            layoutField.setGrid(fieldGridSystem);
        });
        layoutField.setValidators(setValidators(field));
        return layoutField;
    }
    /**
     * Set field validators.
     * @param field field.
     * @return field validators.
     * @throws Exception error.
     */
    private List<Layout.Validator> setValidators(Field field) throws Exception {
        List<Layout.Validator> validators = new ArrayList<>();
        NotEmpty vNotEmpty = field.getAnnotation(NotEmpty.class);
        if (vNotEmpty != null) {
            Layout.Validator validator = new Layout.Validator();
            validator.setType(NotEmpty.class.getSimpleName());
            validators.add(validator);
        }
        Size vSize = field.getAnnotation(Size.class);
        if (vSize != null) {
            Layout.Validator validator = new Layout.Validator();
            validator.setType(Size.class.getSimpleName());
            Map<String, String> attributes = new HashMap<>();
            attributes.put("max", String.valueOf(vSize.max()));
            attributes.put("min", String.valueOf(vSize.min()));
            validator.setAttributes(attributes);
            validators.add(validator);
        }
        Optional.ofNullable(field.getAnnotation(NotNull.class)).ifPresent((a) -> {
            Layout.Validator validator = new Layout.Validator();
            validator.setType(NotNull.class.getSimpleName());
            validators.add(validator);
        });
        Optional.ofNullable(field.getAnnotation(Email.class)).ifPresent((a) -> {
            Layout.Validator validator = new Layout.Validator();
            validator.setType(Email.class.getSimpleName());
            validators.add(validator);
        });
        Optional.ofNullable(field.getAnnotation(MobilePhoneNumber.class)).ifPresent((a) -> {
            Layout.Validator validator = new Layout.Validator();
            validator.setType(MobilePhoneNumber.class.getSimpleName());
            validators.add(validator);
        });
        return validators;
    }
    /**
     * Get class fields (include super classes).
     * @param clazz class.
     * @return class fields.
     * @throws Exception error.
     */
    private List<Field> getClassFields(Class clazz) throws Exception {
        List<Field> result = new ArrayList<>();
        result.addAll(Arrays.asList(clazz.getDeclaredFields()));
        if (clazz.getSuperclass() != null) {
            result.addAll(getClassFields(clazz.getSuperclass()));
        }
        return result;
    }
    /**
     * Define data type by field.
     * @param field entity field.
     * @param layoutField layout field.
     * @return data type.
     * @throws Exception error.
     */
    public void defineDataType(Field field, Layout.Field layoutField) throws Exception {
        layoutField.setAttributes(new HashMap<>());
        DataType type = DataType.STRING;
        if (field.getType().isEnum()) {
            type = DataType.ENUM;
        } else if (field.getGenericType() != null && field.getGenericType() instanceof ParameterizedType) {
            ParameterizedType parType = (ParameterizedType) field.getGenericType();
            Class<?> genericClass = (Class<?>) parType.getActualTypeArguments()[0];
            if (field.getAnnotation(EntityCollection.class) != null) {
                type = ENTITY_COLLECTION;
                EntityCollection anno = field.getAnnotation(EntityCollection.class);
                layoutField.getAttributes().put(DataTypeAttribute.REPRESENTATION_TYPE, anno.type().name());
                if (anno.type() == RepresentationComponentType.LIST_VIEW) {
                    layoutField.getAttributes().put(DataTypeAttribute.COLLECTION_TYPE_METADATA,
                            getEntityListView((Class<? extends DataModel>) genericClass));
                }
            } else if (genericClass.isEnum()) {
                type = DataType.ENUM_COLLECTION;
            }
            layoutField.getAttributes().put(DataTypeAttribute.GENERIC_TYPE, genericClass.getName());
        } else if (Date.class.equals(field.getType()) && field.getAnnotation(Temporal.class) != null) {
            Temporal temporal = field.getAnnotation(Temporal.class);
            if (temporal.value() == TemporalType.DATE) {
                type = DataType.DATE;
            } else if (temporal.value() == TemporalType.TIME) {
                type = DataType.TIME;
            } else if (temporal.value() == TemporalType.TIMESTAMP) {
                type = DataType.DATETIME;
            }
        } else if (field.getAnnotation(Avatar.class) != null) {
            type = DataType.AVATAR;
        } else if (field.getAnnotation(LookupField.class) != null) {
            type = DataType.LOOKUP;
            LookupField anno = field.getAnnotation(LookupField.class);
            layoutField.getAttributes().put(DataTypeAttribute.LOOKUP_TEMPLATE, anno.template());
            layoutField.getAttributes().put(DataTypeAttribute.LOOKUP_ORDER_BY, anno.orderBy());
            layoutField.getAttributes().put(DataTypeAttribute.LOOKUP_ORDER, anno.order());
            List<EntitySearchRequest.FilterCondition> filterConditions = new ArrayList<>();
            Optional.ofNullable(anno.filter()).ifPresent((filter) -> {
                for (FilterCondition fc : filter) {
                    EntitySearchRequest.FilterCondition cond = new EntitySearchRequest.FilterCondition();
                    cond.setOperator(fc.operator());
                    cond.setPredicates(new ArrayList<>());
                    for (FilterPredicate fp : fc.predicates()) {
                        EntitySearchRequest.FilterPredicate predicate = new EntitySearchRequest.FilterPredicate();
                        predicate.setField(fp.field());
                        predicate.setOperator(fp.operator());
                        predicate.setValue(fp.valueTemplate());
                        cond.getPredicates().add(predicate);
                    }
                    filterConditions.add(cond);
                }
            });
            layoutField.getAttributes().put(DataTypeAttribute.LOOKUP_FILTER, filterConditions);
        } else if (field.getAnnotation(TextArea.class) != null) {
            TextArea anno = field.getAnnotation(TextArea.class);
            type = DataType.TEXTAREA;
            layoutField.getAttributes().put(DataTypeAttribute.TEXTAREA_ROWS, anno.rows());
        } else if (field.getAnnotation(MobilePhoneNumber.class) != null) {
            type = DataType.MOBILE_PHONE_NUMBER;
        }
        layoutField.setDataType(type);
    }
}
