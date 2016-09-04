package myreader.fetcher.resttemplate;

import com.rometools.rome.feed.WireFeed;
import com.rometools.rome.feed.atom.Feed;
import com.rometools.rome.feed.rss.Channel;
import org.junit.Test;

import java.util.Collections;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.springframework.http.MediaType.APPLICATION_ATOM_XML;

/**
 * @author Kamill Sokol
 */
public class SyndicationHttpMessageConverterTests {

    private SyndicationHttpMessageConverter converter = new SyndicationHttpMessageConverter(Collections.singletonList(APPLICATION_ATOM_XML));

    @Test
    public void testSupports1() throws Exception {
        assertThat(converter.supports(Object.class), is(false));
    }

    @Test
    public void testSupports2() throws Exception {
        assertThat(converter.supports(Feed.class), is(true));
    }

    @Test
    public void testSupports3() throws Exception {
        assertThat(converter.supports(Channel.class), is(true));
    }

    @Test
    public void testSupports4() throws Exception {
        assertThat(converter.supports(WireFeed.class), is(true));
    }
}
