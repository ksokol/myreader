package myreader.fetcher.resttemplate;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

import com.rometools.rome.feed.WireFeed;
import org.junit.Test;

import com.rometools.rome.feed.atom.Feed;
import com.rometools.rome.feed.rss.Channel;

/**
 * @author Kamill Sokol
 */
public class SyndicationHttpMessageConverterTests {

    private SyndicationHttpMessageConverter converter = new SyndicationHttpMessageConverter();

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
