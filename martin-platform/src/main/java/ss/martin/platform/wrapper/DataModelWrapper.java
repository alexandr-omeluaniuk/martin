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

import ss.martin.platform.entity.DataModel;
import ss.martin.platform.ui.Layout;
import ss.martin.platform.ui.ListView;

/**
 * Data model wrapper.
 * @author ss
 */
public class DataModelWrapper {
    /** Data. */
    private DataModel data;
    /** Layout. */
    private Layout layout;
    /** List view. */
    private ListView listView;
    /**
     * @return the data
     */
    public DataModel getData() {
        return data;
    }
    /**
     * @param data the data to set
     */
    public void setData(DataModel data) {
        this.data = data;
    }
    /**
     * @return the layout
     */
    public Layout getLayout() {
        return layout;
    }
    /**
     * @param layout the layout to set
     */
    public void setLayout(Layout layout) {
        this.layout = layout;
    }
    /**
     * @return the listView
     */
    public ListView getListView() {
        return listView;
    }
    /**
     * @param listView the listView to set
     */
    public void setListView(ListView listView) {
        this.listView = listView;
    }
}
