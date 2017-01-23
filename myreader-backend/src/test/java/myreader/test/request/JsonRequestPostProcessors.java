package myreader.test.request;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.test.web.servlet.JsonUtils;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;

/**
 * @author Kamill Sokol
 */
public final class JsonRequestPostProcessors {

    private static final ObjectMapper objectMapper;

    static {
        objectMapper = new ObjectMapper();
        objectMapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
    }

    private JsonRequestPostProcessors() {
    }

    public static RequestPostProcessor jsonBody(String content) {
        return request -> {
            request.setContentType(APPLICATION_JSON_UTF8_VALUE);
            try {
                if(content.startsWith("{") ) {
                    request.setContent(singleQuotedToDoubleQuotedJsonMap(content).getBytes(UTF_8.name()));
                } else if(content.startsWith("[")) {
                    request.setContent(singleQuotedToDoubleQuotedJsonList(content).getBytes(UTF_8.name()));
                } else {
                    request.setContent(JsonUtils.jsonFromFile(content).getBytes(UTF_8.name()));
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
}
