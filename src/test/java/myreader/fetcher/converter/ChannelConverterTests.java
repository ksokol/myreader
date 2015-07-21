package myreader.fetcher.converter;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.rometools.rome.feed.rss.Channel;
import com.rometools.rome.feed.rss.Item;
import myreader.fetcher.persistence.FetchResult;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import java.util.Arrays;
import java.util.Collections;

/**
 * @author Kamill Sokol
 */
public class ChannelConverterTests {

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Test
    public void noDescription() throws Exception {
        final Channel channel = mock(Channel.class, RETURNS_DEEP_STUBS);
        final Item item = mock(Item.class, RETURNS_DEEP_STUBS);

        when(channel.getItems()).thenReturn(Collections.singletonList(item));
        when(item.getDescription()).thenReturn(null);

        final FetchResult actual = new ChannelConverter(10).convert(channel);

        assertThat(actual.getEntries().get(0).getContent(), nullValue());
    }

    @Test
    public void invalidConstructorArgument() {
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage("maxSize has to be greater than 0");

        new ChannelConverter(-1);
    }

    @Test
    public void maxSize() {
        final Channel channel = mock(Channel.class, RETURNS_DEEP_STUBS);
        final Item item = mock(Item.class, RETURNS_DEEP_STUBS);

        when(channel.getItems()).thenReturn(Arrays.asList(item, item));

        final FetchResult actual = new ChannelConverter(1).convert(channel);

        assertThat(actual.getEntries(), hasSize(1));
    }

}
