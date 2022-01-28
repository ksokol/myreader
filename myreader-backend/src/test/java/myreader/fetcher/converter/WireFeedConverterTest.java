package myreader.fetcher.converter;

import com.rometools.rome.feed.WireFeed;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertThrows;

class WireFeedConverterTest {

  private final WireFeedConverter wireFeedConverter = new WireFeedConverter();

  @Test
  void testConvert() {
    assertThrows(
      IllegalArgumentException.class,
      () -> wireFeedConverter.convert("", new ResponseEntity<>(new MockWireFeed(), HttpStatus.OK)),
      "no converter for class myreader.fetcher.converter.WireFeedConverterTest$MockWireFeed"
    );
  }

  static class MockWireFeed extends WireFeed {
    private static final long serialVersionUID = 1;
  }
}
