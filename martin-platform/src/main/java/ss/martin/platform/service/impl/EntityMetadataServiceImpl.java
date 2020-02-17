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

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
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
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ss.martin.platform.anno.ui.Avatar;
import ss.martin.platform.anno.ui.CardSubTitle;
import ss.martin.platform.anno.ui.CardTitle;
import ss.martin.platform.anno.ui.FormField;
import ss.martin.platform.anno.ui.HiddenField;
import ss.martin.platform.anno.ui.ListViewColumn;
import ss.martin.platform.anno.ui.MaterialIcon;
import ss.martin.platform.anno.validation.MobilePhoneNumber;
import ss.martin.platform.entity.DataModel;
import ss.martin.platform.exception.PlatformException;
import ss.martin.platform.service.EntityMetadataService;
import ss.martin.platform.ui.Layout;
import ss.martin.platform.ui.ListView;

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
        ListView metadata = new ListView();
        metadata.setListViewColumns(new ArrayList());
        metadata.setClassName(clazz.getSimpleName());
        MaterialIcon materialIcon = clazz.getAnnotation(MaterialIcon.class);
        if (materialIcon != null) {
            metadata.setIcon(materialIcon.icon());
        }
        for (Field field : clazz.getDeclaredFields()) {
            ListViewColumn listViewColumnAnno = field.getAnnotation(ListViewColumn.class);
            if (listViewColumnAnno != null) {
                ListView.ListViewColumn listViewColumn = new ListView.ListViewColumn();
                listViewColumn.setId(field.getName());
                listViewColumn.setAlign(listViewColumnAnno.align());
                listViewColumn.setEnumField(field.getType().isEnum() ? field.getType().getSimpleName() : null);
                listViewColumn.setLayoutField(createEntityLayoutField(field));
                listViewColumn.setLink(listViewColumnAnno.link());
                Optional<Type> genericTypes = Optional.ofNullable(field).map(Field::getGenericType);
                genericTypes.ifPresent((gt) -> {
                    if (gt instanceof ParameterizedType) {
                        ParameterizedType parType = (ParameterizedType) gt;
                        Class<?> genericClass = (Class<?>) parType.getActualTypeArguments()[0];
                        listViewColumn.setGenericClass(genericClass.getSimpleName());
                        listViewColumn.setGenericClassEnum(genericClass.isEnum());
                    }
                });
                metadata.getListViewColumns().add(listViewColumn);
            }
        }
        return metadata;
    }
    // =================================================== PRIVATE ====================================================
    /**
     * Create entity layout field from entity field.
     * @param field entity field.
     * @return layout field.
     * @throws Exception error.
     */
    private Layout.Field createEntityLayoutField(Field field) throws Exception {
        Annotation[] annotations = field.getAnnotations();
        if (LOG.isTraceEnabled()) {
            LOG.trace("field [" + field.getName() + "], annotations [" + annotations.length + "]");
        }
        Layout.Field layoutField = new Layout.Field();
        layoutField.setName(field.getName());
        Avatar avatar = field.getAnnotation(Avatar.class);
        if (Date.class.equals(field.getType())) {
            Temporal temporal = field.getAnnotation(Temporal.class);
            if (temporal == null || temporal.value() == null) {
                throw new PlatformException("wrong date field configuration! Field [" + field.getName()
                        + "] must have @Temporal annotation!");
            } else {
                layoutField.setFieldType(temporal.value().name());
            }
        } else if (avatar != null) {
            layoutField.setFieldType(Avatar.class.getSimpleName());
        } else {
            layoutField.setFieldType(field.getType().getSimpleName());
        }
        Optional.ofNullable(field.getAnnotation(FormField.class)).ifPresent((grid) -> {
            Layout.Grid fieldGridSystem = new Layout.Grid();
            fieldGridSystem.setLg(grid.lg());
            fieldGridSystem.setMd(grid.lg());
            fieldGridSystem.setSm(grid.sm());
            fieldGridSystem.setXs(grid.xs());
            layoutField.setGrid(fieldGridSystem);
        });
        HiddenField hidden = field.getAnnotation(HiddenField.class);
        layoutField.setHidden(hidden != null);
        layoutField.setValidators(setValidators(field));
        Optional<Type> genericTypes = Optional.ofNullable(field).map(Field::getGenericType);
        genericTypes.ifPresent((gt) -> {
            if (gt instanceof ParameterizedType) {
                ParameterizedType parType = (ParameterizedType) gt;
                Class<?> genericClass = (Class<?>) parType.getActualTypeArguments()[0];
                layoutField.setGenericClass(genericClass.getSimpleName());
                layoutField.setGenericClassEnum(genericClass.isEnum());
            }
        });
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
}
