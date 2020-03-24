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
package ss.martin.platform.test.data;

import org.springframework.stereotype.Component;
import ss.martin.platform.anno.ui.MaterialIcon;
import ss.martin.platform.constants.ApplicationModule;
import ss.martin.platform.constants.RepresentationComponentSource;
import ss.martin.platform.entity.DataModel;
import ss.martin.platform.security.ApplicationModuleProvider;
import ss.martin.platform.ui.RepresentationComponent;
import ss.martin.platform.ui.TabPanel;

/**
 *
 * @author ss
 */
@MaterialIcon(icon = "supervised_user_circle")
@Component("Test")
class TestModule implements ApplicationModuleProvider {
    @Override
    public ApplicationModule module() {
        return ApplicationModule.CRM;
    }
    @Override
    public Class<? extends DataModel>[] dataModel() {
        return new Class[] {};
    }
    @Override
    public RepresentationComponent representationComponent() {
        TabPanel component = new TabPanel();
        component.setSource(RepresentationComponentSource.APPLICATION_MODULE);
        MaterialIcon icon = getClass().getAnnotation(MaterialIcon.class);
        component.setIcon(icon.icon());
        component.setPath("crm");
        component.setClassName(module().name());
        return component;
    }
}
