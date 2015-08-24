package myreader.fetcher.converter;

import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.http.HttpStatus.OK;

import com.rometools.rome.feed.atom.Content;
import com.rometools.rome.feed.atom.Entry;
import com.rometools.rome.feed.atom.Feed;
import myreader.fetcher.persistence.FetchResult;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.http.ResponseEntity;

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

        when(entry.getAlternateLinks().get(0).getHref()).thenReturn("http://localhost");
        when(feed.getEntries()).thenReturn(Collections.singletonList(entry));

        final Content content = mock(Content.class);

        when(entry.getContents()).thenReturn(Collections.singletonList(content));
        when(content.getValue()).thenReturn(null);

        final FetchResult actual = new AtomConverter(10).convert("http://localhost", new ResponseEntity<>(feed, OK));

        assertThat(actual.getEntries().get(0).getContent(), is(EMPTY));
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

        final FetchResult actual = new AtomConverter(1).convert("", new ResponseEntity<>(feed, OK));

        assertThat(actual.getEntries(), hasSize(1));
    }
}
