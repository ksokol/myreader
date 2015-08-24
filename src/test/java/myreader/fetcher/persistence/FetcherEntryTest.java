package myreader.fetcher.persistence;

import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class FetcherEntryTest {

    @Test
    public void testGetContent() throws Exception {
        final FetcherEntry fetcherEntry = new FetcherEntry();
        fetcherEntry.setUrl("http://url");
        fetcherEntry.setFeedUrl("http://feedUrl");

        assertThat(fetcherEntry.getContent(), is(EMPTY));
        assertThat(fetcherEntry.getContent(), is(EMPTY));
    }
}
