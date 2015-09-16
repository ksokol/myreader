package org.springframework.test.web.servlet.result;

import static net.javacrumbs.jsonunit.JsonAssert.assertJsonEquals;

import java.io.UnsupportedEncodingException;

import org.springframework.test.web.servlet.JsonUtils;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultMatcher;

/**
 * @author Kamill Sokol
 */
public class ContentResultMatchersJsonAssertSupport {

    public static ResultMatcher jsonEquals(final String pathToJsonFile) {
        return new ResultMatcher() {
            public void match(MvcResult result) throws UnsupportedEncodingException {
                String actual = result.getResponse().getContentAsString();
                String json = JsonUtils.jsonFromFile(pathToJsonFile);
                assertJsonEquals(json,  actual);
            }
        };
    }
}
