/*
 * The MIT License
 *
 * Copyright 2021 alex.
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
package ss.martin.platform.service;

import ss.entity.martin.EntityImage;

/**
 * Image service.
 * @author alex
 */
public interface ImageService {
    /**
     * Convert image to square thumbnail.
     * @param data image data.
     * @param thumbnailMinSize thumbnail min size.
     * @return thumbnail data.
     * @throws Exception error.
     */
    byte[] convertToThumbnail(byte[] data, int thumbnailMinSize) throws Exception;
    /**
     * Save image to disk.
     * @param data image data.
     * @return absolute file path.
     * @throws Exception error.
     */
    String saveImageToDisk(byte[] data) throws Exception;
    /**
     * Read image from disk.
     * @param image image.
     * @return image data.
     * @throws Exception error.
     */
    byte[] readImageFromDisk(EntityImage image) throws Exception;
}
