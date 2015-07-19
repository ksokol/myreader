package myreader.fetcher.sanitizer;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import org.apache.commons.lang3.StringUtils;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

/**
 * @author Kamill Sokol
 */
public class EntryLinkSanitizerTest {

    private static String HTTP_URL = "http://localhost";
    private static String HTTPS_URL = "https://localhost";

    @Rule
    public ExpectedException expectedException = ExpectedException.none();
    @Test
    public void test1() {
        String sanitized = new EntryLinkSanitizer().sanitize("/test", HTTP_URL);
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

    @Test
    public void test5() {
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage("entryLink is null");

        EntryLinkSanitizer.sanitize(null, null);
    }

    @Test
    public void test6() {
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage("feedLink is null");

        EntryLinkSanitizer.sanitize(HTTPS_URL + "/test", null);
    }

    @Test
    public void test7() {
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage("entryLink is null");

        String sanitized = EntryLinkSanitizer.sanitize(null, HTTPS_URL);
        assertThat(sanitized, is(StringUtils.EMPTY));
    }

    @Test
    public void test8() {
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage("feedLink must start with http(s)?://");

        EntryLinkSanitizer.sanitize("/test", "test");
    }

    @Test
    public void test9() {
        String sanitized = EntryLinkSanitizer.sanitize("test", HTTP_URL);
        assertThat(sanitized, is(HTTP_URL + "/test"));
    }

    @Test
    public void test10() {
        String sanitized = EntryLinkSanitizer.sanitize("/test", HTTP_URL);
        assertThat(sanitized, is(HTTP_URL + "/test"));
    }

    @Test
    public void test11() {
        String sanitized = EntryLinkSanitizer.sanitize("test", HTTP_URL);
        assertThat(sanitized, is(HTTP_URL + "/test"));
    }

    @Test
    public void test12() {
        String sanitized = EntryLinkSanitizer.sanitize("/test", HTTP_URL);
        assertThat(sanitized, is(HTTP_URL + "/test"));
    }
}
