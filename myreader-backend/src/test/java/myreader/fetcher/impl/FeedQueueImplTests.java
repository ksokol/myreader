package myreader.fetcher.impl;

import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import myreader.fetcher.FeedQueue;
import myreader.fetcher.impl.FeedQueueImpl;
import myreader.fetcher.persistence.FetchResult;
import org.junit.Before;
import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class FeedQueueImplTests {

    private FeedQueue uut;

    @Before
    public void setUp() {
        uut = new FeedQueueImpl();
    }

    @Test
    public void add() {
        uut.add(new FetchResult("url"));
        assertThat(uut.getSize(), is(1));
    }

    @Test
    public void addDuplicate() {
        uut.add(new FetchResult("url"));
        uut.add(new FetchResult("url"));
        assertThat(uut.getSize(), is(1));
    }

    @Test
    public void poll() {
        assertThat(uut.poll(), nullValue());
        uut.add(new FetchResult("url"));
        assertThat(uut.poll(), is(new FetchResult("url")));
        assertThat(uut.poll(), nullValue());
    }

    @Test
    public void getSnapshot() {
        uut.add(new FetchResult("url"));
        assertThat(uut.getSnapshot(), hasItems("url"));
    }
}
