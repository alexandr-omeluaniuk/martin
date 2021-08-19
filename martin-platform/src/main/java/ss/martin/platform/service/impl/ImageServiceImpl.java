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
package ss.martin.platform.service.impl;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.UUID;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import ss.entity.martin.EntityImage;
import ss.martin.platform.service.ImageService;
import ss.martin.platform.spring.config.PlatformConfiguration;

/**
 * Image service implementation.
 * @author alex
 */
@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
class ImageServiceImpl implements ImageService {
    /** Platform configuration. */
    @Autowired
    private PlatformConfiguration platformConfiguration;
    @Override
    public byte[] convertToThumbnail(byte[] data, int thumbnailMinSize) throws Exception {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Thumbnails.Builder is = Thumbnails.of(new ByteArrayInputStream(data));
            BufferedImage bufImage = is.scale(1d).asBufferedImage();
            int height = bufImage.getHeight();
            int width = bufImage.getWidth();
            is = Thumbnails.of(new ByteArrayInputStream(data));
            if (height > thumbnailMinSize && width > thumbnailMinSize) {
                if (height < width) {
                    is.height(thumbnailMinSize).toOutputStream(baos);
                } else {
                    is.width(thumbnailMinSize).toOutputStream(baos);
                }
                return baos.toByteArray();
            }
        }
        return data;
    }

    @Override
    public String saveImageToDisk(byte[] data) throws Exception {
        String randomName = generateRandomFilename();
        File file = new File(getRootFolder(), randomName);
        Files.write(Paths.get(file.toURI()), data, StandardOpenOption.CREATE);
        return randomName;
    }

    @Override
    public byte[] readImageFromDisk(EntityImage image) throws Exception {
        File file = new File(getRootFolder(), image.getFileNameOnDisk());
        return Files.readAllBytes(Paths.get(file.toURI()));
    }
    
    private File getRootFolder() {
        return new File(platformConfiguration.getImagesStoragePath());
    }
    
    private String generateRandomFilename() {
        return System.currentTimeMillis() + "." + UUID.randomUUID().toString();
    }
}
