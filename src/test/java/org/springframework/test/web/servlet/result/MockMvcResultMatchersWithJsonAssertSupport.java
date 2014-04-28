package org.springframework.test.web.servlet.result;

/**
 * @author Kamill Sokol
 */
public abstract class MockMvcResultMatchersWithJsonAssertSupport {

    private MockMvcResultMatchersWithJsonAssertSupport() {}

    public static ContentResultMatchersWithJsonAssertSupport content() {
        return new ContentResultMatchersWithJsonAssertSupport();
    }

}
