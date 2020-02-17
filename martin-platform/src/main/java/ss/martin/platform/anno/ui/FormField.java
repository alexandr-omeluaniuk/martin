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
package ss.martin.platform.anno.ui;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * UI form field. Can be updated via UI.
 * UI 12-columns grid system annotation
 * @author ss
 */
@Target(value = {ElementType.FIELD})
@Retention(value = RetentionPolicy.RUNTIME)
public @interface FormField {
    /**
     * Defines the number of grids the component is going to use. It's applied for the lg breakpoint 
     * and wider screens if not overridden.
     * @return number of grids.
     */
    public String lg() default "false";
    /**
     * Defines the number of grids the component is going to use. It's applied for the md breakpoint
     * and wider screens if not overridden.
     * @return number of grids.
     */
    public String md() default "false";
    /**
     * Defines the number of grids the component is going to use. It's applied for the sm breakpoint 
     * and wider screens if not overridden.
     * @return number of grids.
     */
    public String sm() default "false";
    /**
     * Defines the number of grids the component is going to use.
     * It's applied for all the screen sizes with the lowest priority.
     * @return number of grids.
     */
    public String xs() default "12";
}
