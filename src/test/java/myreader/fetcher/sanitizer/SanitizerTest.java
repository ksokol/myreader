package myreader.fetcher.sanitizer;

import myreader.fetcher.persistence.FetchResult;
import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class SanitizerTest {

    @Test
    public void testNpeSanitize1() throws Exception {
        Sanitizer.sanitize(null);
    }

    @Test
    public void testNpeSanitize2() throws Exception {
        new Sanitizer().sanitize(new FetchResult(null, null, null));
    }
}
