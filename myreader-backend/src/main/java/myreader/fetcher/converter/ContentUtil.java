package myreader.fetcher.converter;

import com.rometools.rome.feed.atom.Content;
import com.rometools.rome.feed.atom.Entry;
import com.rometools.rome.feed.rss.Description;
import com.rometools.rome.feed.rss.Item;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

/**
 * @author Kamill Sokol
 */
class ContentUtil {

    private ContentUtil() {
        // prevent instantiation
    }

    static String getContent(Entry entry) {
        List<Content> contents = entry.getContents();

        if (!contents.isEmpty()) {
            Content content = contents.get(0);
            if(StringUtils.isNotBlank(content.getValue())) {
                return content.getValue();
            }
        }

        return null;
    }

    static String getContent(Item item) {
        final Description description = item.getDescription();
        return description == null ? null : description.getValue();
    }
}
