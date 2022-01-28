package myreader.fetcher.resttemplate;

import com.rometools.rome.feed.WireFeed;
import com.rometools.rome.feed.atom.Feed;
import com.rometools.rome.feed.rss.Channel;
import org.junit.jupiter.api.Test;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_ATOM_XML;

class SyndicationHttpMessageConverterTests {

  private final SyndicationHttpMessageConverter converter = new SyndicationHttpMessageConverter(Collections.singletonList(APPLICATION_ATOM_XML));

  @Test
  void testSupports1() {
    assertThat(converter.supports(Object.class))
      .isFalse();
  }

  @Test
  void testSupports2() {
    assertThat(converter.supports(Feed.class))
      .isTrue();
  }

  @Test
  void testSupports3() {
    assertThat(converter.supports(Channel.class))
      .isTrue();
  }

  @Test
  void testSupports4() {
    assertThat(converter.supports(WireFeed.class))
      .isTrue();
  }
}
