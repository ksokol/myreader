package myreader.fetcher.persistence;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class FetchResultTest {

    @Test
    public void testEquals() throws Exception {
        final FetchResult first = new FetchResult("irrelevant");

        assertThat(first.equals(new Object()), is(false));
    }

    @Test
    public void testEquals1() throws Exception {
        final FetchResult first = new FetchResult("irrelevant");

        assertThat(first.equals(first), is(true));
    }

    @Test
    public void testEquals3() throws Exception {
        final FetchResult first = new FetchResult("irrelevant");

        assertThat(first.equals(null), is(false));
    }

    @Test
    public void testHashCode() throws Exception {
        final FetchResult first = new FetchResult("irrelevant");
        final FetchResult second = new FetchResult("irrelevant");

        assertThat(first.hashCode(), is(second.hashCode()));
    }
}
