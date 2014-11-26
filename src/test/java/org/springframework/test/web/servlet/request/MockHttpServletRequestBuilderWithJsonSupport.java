package org.springframework.test.web.servlet.request;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.servlet.JsonUtils;
import org.springframework.util.Assert;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * @author Kamill Sokol
 */
public class MockHttpServletRequestBuilderWithJsonSupport extends MockHttpServletRequestBuilder {

    private final ObjectMapper om;

    MockHttpServletRequestBuilderWithJsonSupport(HttpMethod httpMethod, String urlTemplate, Object... urlVariables) {
        super(httpMethod, urlTemplate, urlVariables);
        om = new ObjectMapper();
        om.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
    }

    /**
     *
     * @param content may be a file relative to resources/json or a json with single or double quoted string/value pairs
     * @return a MockHttpServletRequestBuilder
     * @throws IOException
     */
    public MockHttpServletRequestBuilder json(String content) throws IOException {
        Assert.notNull(content);
        if(content.startsWith("{") ) {
            super.content(singleQuotedToDoubleQuotedJsonMap(content));
        } else if(content.startsWith("[")) {
            super.content(singleQuotedToDoubleQuotedJsonList(content));
        } else {
            super.content(JsonUtils.jsonFromFile(content));
        }
        return this;
    }

    private String singleQuotedToDoubleQuotedJsonMap(String json) throws IOException {
        Map map = om.readValue(json, Map.class);
        return om.writeValueAsString(map);
    }

    private String singleQuotedToDoubleQuotedJsonList(String json) throws IOException {
        List list = om.readValue(json, List.class);
        return om.writeValueAsString(list);
    }

}
