package myreader.fetcher.impl;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

/**
 * @author dev@sokol-web.de <Kamill Sokol>
 */
public class EntryLinkSanitizerTest {

    private static String HTTP_URL = "http://localhost";
    private static String HTTPS_URL = "https://localhost";

    @Test
    public void test1() {
        String sanitized = EntryLinkSanitizer.sanitize("/test", HTTP_URL);
        assertThat(sanitized, is(HTTP_URL + "/test"));
    }

    @Test
    public void test2() {
        String sanitized = EntryLinkSanitizer.sanitize(HTTP_URL + "/test", HTTP_URL);
        assertThat(sanitized, is(HTTP_URL + "/test"));
    }

    @Test
    public void test3() {
        String sanitized = EntryLinkSanitizer.sanitize("test", HTTP_URL);
        assertThat(sanitized, is(HTTP_URL + "/test"));
    }

    @Test
    public void test4() {
        String sanitized = EntryLinkSanitizer.sanitize(HTTPS_URL + "/test", HTTPS_URL);
        assertThat(sanitized, is(HTTPS_URL + "/test"));
    }
}
