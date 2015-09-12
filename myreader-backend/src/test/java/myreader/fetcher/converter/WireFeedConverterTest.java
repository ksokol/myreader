package myreader.fetcher.converter;

import com.rometools.rome.feed.WireFeed;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * @author Kamill Sokol
 */
public class WireFeedConverterTest {

    private WireFeedConverter wireFeedConverter = new WireFeedConverter();

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Test
    public void testConvert() throws Exception {
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage("no converter for class myreader.fetcher.converter.WireFeedConverterTest$MockWireFeed");
        wireFeedConverter.convert("", new ResponseEntity<>(new MockWireFeed(), HttpStatus.OK));
    }

    static class MockWireFeed extends WireFeed {}
}
