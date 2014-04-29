package org.springframework.test.web.servlet.result;

/**
 * @author Kamill Sokol
 */
public abstract class MockMvcResultMatchersWithJsonAssertSupport {

    private MockMvcResultMatchersWithJsonAssertSupport() {}

    public static ContentResultMatchersJsonAssertSupport content() {
        return new ContentResultMatchersJsonAssertSupport();
    }

}
