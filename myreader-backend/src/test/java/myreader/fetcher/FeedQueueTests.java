package myreader.fetcher;

import myreader.fetcher.persistence.FetchResult;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
public class FeedQueueTests {

    private FeedQueue queue;

    @Before
    public void setUp() {
        queue = new FeedQueue();
    }

    @Test
    public void add() {
        queue.add(new FetchResult("url"));
        assertThat(queue.getSize(), is(1));
    }

    @Test
    public void addDuplicate() {
        queue.add(new FetchResult("url"));
        queue.add(new FetchResult("url"));
        assertThat(queue.getSize(), is(1));
    }

    @Test
    public void take() {
        queue.add(new FetchResult("url"));
        assertThat(queue.take(), is(new FetchResult("url")));
        assertThat(queue.take(), is(nullValue()));
    }
}
