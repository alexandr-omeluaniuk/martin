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

import ss.martin.platform.constants.RepresentationComponentSource;
import ss.martin.platform.constants.RepresentationComponentType;

/**
 * UI representation component.
 * @author ss
 */
public abstract class RepresentationComponent {
    /** Representation component type. */
    protected RepresentationComponentType type;
    /** Representation component source. */
    private RepresentationComponentSource source;
    /** URL relative path. */
    private String path;
    /**
     * @return the type
     */
    public RepresentationComponentType getType() {
        return type;
    }
    /**
     * @return the source
     */
    public RepresentationComponentSource getSource() {
        return source;
    }
    /**
     * @param source the source to set
     */
    public void setSource(RepresentationComponentSource source) {
        this.source = source;
    }
    /**
     * @return the path
     */
    public String getPath() {
        return path;
    }
    /**
     * @param path the path to set
     */
    public void setPath(String path) {
        this.path = path;
    }
}
