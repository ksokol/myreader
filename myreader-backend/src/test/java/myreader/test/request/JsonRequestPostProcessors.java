package myreader.test.request;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.FileUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;

/**
 * @author Kamill Sokol
 */
@SuppressWarnings("PMD.AvoidLiteralsInIfCondition")
public final class JsonRequestPostProcessors {

    private static final ObjectMapper objectMapper;

    static {
        objectMapper = new ObjectMapper();
        objectMapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
    }

    private JsonRequestPostProcessors() {
        //disallow instantiation
    }

    public static RequestPostProcessor jsonBody(String content) {
        return request -> {
            request.setContentType(APPLICATION_JSON_UTF8_VALUE);
            try {
                if (content.charAt(0) == '{' ) {
                    request.setContent(singleQuotedToDoubleQuotedJsonMap(content).getBytes(UTF_8.name()));
                } else if (content.charAt(0) == '[') {
                    request.setContent(singleQuotedToDoubleQuotedJsonList(content).getBytes(UTF_8.name()));
                } else {
                    request.setContent(jsonFromFile(content).getBytes(UTF_8.name()));
                }
            } catch (IOException exception) {
                throw new IllegalArgumentException(exception.getMessage(), exception);
            }
            return request;
        };
    }

    private static String singleQuotedToDoubleQuotedJsonMap(String json) throws IOException {
        Map map = objectMapper.readValue(json, Map.class);
        return objectMapper.writeValueAsString(map);
    }

    private static String singleQuotedToDoubleQuotedJsonList(String json) throws IOException {
        List list = objectMapper.readValue(json, List.class);
        return objectMapper.writeValueAsString(list);
    }

    private static String jsonFromFile(String file) {
        ClassPathResource classPathResource = new ClassPathResource(file);
        try {
            return FileUtils.readFileToString(classPathResource.getFile());
        } catch (IOException e) {
            throw new IllegalArgumentException(e.getMessage(), e);
        }
    }
}
