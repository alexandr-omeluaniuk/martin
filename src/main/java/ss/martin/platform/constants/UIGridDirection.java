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
package ss.martin.platform.constants;

/**
 * UI 12-columns grid system direction.
 * @author ss
 */
public enum UIGridDirection {
    /** Row. */
    ROW("row"),
    /** Row-reverse. */
    ROW_REVERSE("row-reverse"),
    /** Column. */
    COLUMN("column"),
    /** Column-reverse. */
    COLUMN_REVERSE("column-reverse");
    /** Direction. */
    private final String direction;
    /**
     * Constructor.
     * @param direction direction.
     */
    private UIGridDirection(String direction) {
        this.direction = direction;
    }
    /**
     * Get direction.
     * @return direction.
     */
    public String getDirection() {
        return this.direction;
    }
}
