package myreader.fetcher.converter;

import com.rometools.modules.content.ContentModuleImpl;
import com.rometools.rome.feed.atom.Content;
import com.rometools.rome.feed.atom.Entry;
import com.rometools.rome.feed.rss.Description;
import com.rometools.rome.feed.rss.Item;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;

class ContentUtilTest {

  @Test
  void shouldReturnNullWhenAtomEntryContentIsNull() {
    assertThat(ContentUtil.getContent(new Entry()))
      .isNull();
  }

  @Test
  void shouldReturnContentOfAtomEntry() {
    var content = new Content();
    content.setValue("expected content");
    var entry = new Entry();
    entry.setContents(Collections.singletonList(content));

    assertThat(ContentUtil.getContent(entry))
      .isEqualTo("expected content");
  }

  @Test
  void shouldReturnContentFromContentModuleOfAtomEntry() {
    var content = new Content();
    content.setValue("expected content");
    var module = new ContentModuleImpl();
    module.setContents(Arrays.asList("expected content1", "expected content2"));

    Entry entry = new Entry();
    entry.setContents(Collections.singletonList(content));
    entry.setModules(Collections.singletonList(module));

    assertThat(ContentUtil.getContent(entry))
      .isEqualTo("expected content1");
  }

  @Test
  void shouldReturnNullWhenRssEntryContentIsNull() {
    assertThat(ContentUtil.getContent(new Item()))
      .isNull();
  }

  @Test
  void shouldReturnContentOfRssEntry() {
    var description = new Description();
    description.setValue("expected description");
    var item = new Item();
    item.setDescription(description);

    assertThat(ContentUtil.getContent(item))
      .isEqualTo("expected description");
  }

  @Test
  void shouldReturnContentFromContentModuleOfRssEntry() {
    var description = new Description();
    description.setValue("expected description");
    var module = new ContentModuleImpl();
    module.setContents(Arrays.asList("expected content1", "expected content2"));

    var item = new Item();
    item.setDescription(description);
    item.setModules(Collections.singletonList(module));

    assertThat(ContentUtil.getContent(item))
      .isEqualTo("expected content1");
  }
}
