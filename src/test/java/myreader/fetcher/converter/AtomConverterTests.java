package myreader.fetcher.converter;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.rometools.rome.feed.atom.Content;
import myreader.fetcher.persistence.FetchResult;
import org.junit.Rule;
import org.junit.Test;

import com.rometools.rome.feed.atom.Entry;
import com.rometools.rome.feed.atom.Feed;
import org.junit.rules.ExpectedException;

import java.util.Arrays;
import java.util.Collections;

/**
 * @author Kamill Sokol
 */
public class AtomConverterTests {

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Test
    public void noContent() throws Exception {
        final Feed feed = mock(Feed.class, RETURNS_DEEP_STUBS);
        final Entry entry = mock(Entry.class, RETURNS_DEEP_STUBS);

        when(feed.getEntries()).thenReturn(Collections.singletonList(entry));

        final Content content = mock(Content.class);

        when(entry.getContents()).thenReturn(Collections.singletonList(content));
        when(content.getValue()).thenReturn(null);

        final FetchResult actual = new AtomConverter(10).convert(feed);

        assertThat(actual.getEntries().get(0).getContent(), nullValue());
    }

    @Test
    public void invalidConstructorArgument() {
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage("maxSize has to be greater than 0");

        new AtomConverter(-1);
    }

    @Test
    public void maxSize() {
        final Feed feed = mock(Feed.class, RETURNS_DEEP_STUBS);
        final Entry entry = mock(Entry.class, RETURNS_DEEP_STUBS);

        when(feed.getEntries()).thenReturn(Arrays.asList(entry, entry));

        final FetchResult actual = new AtomConverter(1).convert(feed);

        assertThat(actual.getEntries(), hasSize(1));
    }
}
