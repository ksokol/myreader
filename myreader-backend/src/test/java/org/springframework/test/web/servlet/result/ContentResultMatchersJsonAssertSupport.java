package org.springframework.test.web.servlet.result;

import org.springframework.test.web.servlet.JsonUtils;
import org.springframework.test.web.servlet.ResultMatcher;

import static net.javacrumbs.jsonunit.JsonAssert.assertJsonEquals;

/**
 * @author Kamill Sokol
 *
 * @deprecated
 */
public class ContentResultMatchersJsonAssertSupport {

    /**
     * @deprecated
     */
    public static ResultMatcher jsonEquals(final String pathToJsonFile) {
        return result -> {
            String actual = result.getResponse().getContentAsString();
            String json = JsonUtils.jsonFromFile(pathToJsonFile);
            assertJsonEquals(json,  actual);
        };
    }
}
