package org.springframework.test.web.servlet;

import org.apache.commons.io.FileUtils;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

/**
 * @author Kamill Sokol
 */
public class JsonUtils {

    public static String jsonFromFile(String file) {
        ClassPathResource classPathResource = new ClassPathResource("/json/"+file);
        try {
            return FileUtils.readFileToString(classPathResource.getFile());
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }
}
