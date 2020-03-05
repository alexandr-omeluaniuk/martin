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
package ss.martin.platform.ui;

import java.util.List;
import ss.martin.platform.constants.ListViewColumnAlign;
import ss.martin.platform.constants.RepresentationComponentType;

/**
 * Entity list view metadata.
 * @author ss
 */
public class ListView extends RepresentationComponent {
    /** Entity class id. */
    private String className;
    /** Data model material icon. */
    private String icon;
    /** List view columns. */
    private List<ListViewColumn> listViewColumns;
    /** Has audit info. */
    private boolean audit;
    /**
     * Constructor.
     */
    public ListView() {
        this.type = RepresentationComponentType.LIST_VIEW;
    }
    /**
     * @return the icon
     */
    public String getIcon() {
        return icon;
    }
    /**
     * @param icon the icon to set
     */
    public void setIcon(String icon) {
        this.icon = icon;
    }
    /**
     * @return the className
     */
    public String getClassName() {
        return className;
    }
    /**
     * @param className the className to set
     */
    public void setClassName(String className) {
        this.className = className;
    }
    /**
     * @return the audit
     */
    public boolean isAudit() {
        return audit;
    }
    /**
     * @param audit the audit to set
     */
    public void setAudit(boolean audit) {
        this.audit = audit;
    }
    /**
     * @return the listViewColumns
     */
    public List<ListViewColumn> getListViewColumns() {
        return listViewColumns;
    }
    /**
     * @param listViewColumns the listViewColumns to set
     */
    public void setListViewColumns(List<ListViewColumn> listViewColumns) {
        this.listViewColumns = listViewColumns;
    }
    /**
     * List view column.
     */
    public static class ListViewColumn {
        /** Field id. */
        private String id;
        /** Field align. */
        private ListViewColumnAlign align;
        /** Is enum constant. */
        private String enumField;
        /** Generic class. */
        private String genericClass;
        /** Is generic class enum?. */
        private boolean genericClassEnum;
        /** Layout field metadata. */
        private Layout.Field layoutField;
        /** Is link. */
        private boolean link;
        /** Is sortable. */
        private boolean sortable;
        /**
         * @return the id
         */
        public String getId() {
            return id;
        }
        /**
         * @param id the id to set
         */
        public void setId(String id) {
            this.id = id;
        }
        /**
         * @return the align
         */
        public ListViewColumnAlign getAlign() {
            return align;
        }
        /**
         * @param align the align to set
         */
        public void setAlign(ListViewColumnAlign align) {
            this.align = align;
        }
        /**
         * @return the enumField
         */
        public String getEnumField() {
            return enumField;
        }
        /**
         * @param enumField the enumField to set
         */
        public void setEnumField(String enumField) {
            this.enumField = enumField;
        }
        /**
         * @return the genericClass
         */
        public String getGenericClass() {
            return genericClass;
        }
        /**
         * @param genericClass the genericClass to set
         */
        public void setGenericClass(String genericClass) {
            this.genericClass = genericClass;
        }
        /**
         * @return the genericClassEnum
         */
        public boolean isGenericClassEnum() {
            return genericClassEnum;
        }
        /**
         * @param genericClassEnum the genericClassEnum to set
         */
        public void setGenericClassEnum(boolean genericClassEnum) {
            this.genericClassEnum = genericClassEnum;
        }
        /**
         * @return the layoutField
         */
        public Layout.Field getLayoutField() {
            return layoutField;
        }
        /**
         * @param layoutField the layoutField to set
         */
        public void setLayoutField(Layout.Field layoutField) {
            this.layoutField = layoutField;
        }
        /**
         * @return the link
         */
        public boolean isLink() {
            return link;
        }
        /**
         * @param link the link to set
         */
        public void setLink(boolean link) {
            this.link = link;
        }
        /**
         * @return the sortable
         */
        public boolean isSortable() {
            return sortable;
        }
        /**
         * @param sortable the sortable to set
         */
        public void setSortable(boolean sortable) {
            this.sortable = sortable;
        }
    }
}
