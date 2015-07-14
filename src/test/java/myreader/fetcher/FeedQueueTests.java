package myreader.fetcher;

import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import org.junit.Before;
import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class FeedQueueTests {

    private FeedQueue uut;

    @Before
    public void setUp() {
        uut = new FeedQueue();
    }

    @Test
    public void add() {
        uut.add("url");
        assertThat(uut.getSize(), is(1));
    }

    @Test
    public void addDuplicate() {
        uut.add("url");
        uut.add("url");
        assertThat(uut.getSize(), is(1));
    }

    @Test
    public void poll() {
        assertThat(uut.poll(), nullValue());
        uut.add("url");
        assertThat(uut.poll(), is("url"));
        assertThat(uut.poll(), nullValue());
    }

    @Test
    public void getSnapshot() {
        uut.add("url");
        assertThat(uut.getSnapshot(), hasItems("url"));
    }
}
