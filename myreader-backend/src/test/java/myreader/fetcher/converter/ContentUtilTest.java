package myreader.fetcher.converter;

import com.rometools.modules.content.ContentModule;
import com.rometools.modules.content.ContentModuleImpl;
import com.rometools.rome.feed.atom.Content;
import com.rometools.rome.feed.atom.Entry;
import com.rometools.rome.feed.rss.Description;
import com.rometools.rome.feed.rss.Item;
import org.junit.Test;

import java.util.Arrays;
import java.util.Collections;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.*;

/**
 * @author Kamill Sokol
 */
public class ContentUtilTest {

    @Test
    public void shouldReturnNullWhenAtomEntryContentIsNull() {
        assertThat(ContentUtil.getContent(new Entry()), nullValue());
    }

    @Test
    public void shouldReturnContentOfAtomEntry() {
        Content content = new Content();
        content.setValue("expected content");
        Entry entry = new Entry();
        entry.setContents(Collections.singletonList(content));

        assertThat(ContentUtil.getContent(entry), is("expected content"));
    }

    @Test
    public void shouldReturnContentFromContentModuleOfAtomEntry() {
        Content content = new Content();
        content.setValue("expected content");
        ContentModule module = new ContentModuleImpl();
        module.setContents(Arrays.asList("expected content1", "expected content2"));

        Entry entry = new Entry();
        entry.setContents(Collections.singletonList(content));
        entry.setModules(Collections.singletonList(module));

        assertThat(ContentUtil.getContent(entry), is("expected content1"));
    }

    @Test
    public void shouldReturnNullWhenRssEntryContentIsNull() {
        assertThat(ContentUtil.getContent(new Item()), nullValue());
    }

    @Test
    public void shouldReturnContentOfRssEntry() {
        Description description = new Description();
        description.setValue("expected description");
        Item item = new Item();
        item.setDescription(description);

        assertThat(ContentUtil.getContent(item), is("expected description"));
    }

    @Test
    public void shouldReturnContentFromContentModuleOfRssEntry() {
        Description description = new Description();
        description.setValue("expected description");
        ContentModule module = new ContentModuleImpl();
        module.setContents(Arrays.asList("expected content1", "expected content2"));

        Item item = new Item();
        item.setDescription(description);
        item.setModules(Collections.singletonList(module));

        assertThat(ContentUtil.getContent(item), is("expected content1"));
    }
}
