package org.springframework.test.web.servlet.result;

import org.springframework.test.web.servlet.JsonUtils;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultMatcher;

import java.io.UnsupportedEncodingException;

import static net.javacrumbs.jsonunit.JsonAssert.assertJsonEquals;

/**
 * @author Kamill Sokol
 */
public class ContentResultMatchersJsonAssertSupport {

    public static ResultMatcher isJsonEqual(final String pathToJsonFile) {
        return new ResultMatcher() {
            public void match(MvcResult result) throws UnsupportedEncodingException {
                String actual = result.getResponse().getContentAsString();
                String json = JsonUtils.jsonFromFile(pathToJsonFile);
                assertJsonEquals(json,  actual);
            }
        };
    }
}
