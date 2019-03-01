package myreader.fetcher.converter;

import com.rometools.modules.content.ContentModule;
import com.rometools.rome.feed.atom.Content;
import com.rometools.rome.feed.atom.Entry;
import com.rometools.rome.feed.module.Extendable;
import com.rometools.rome.feed.module.Module;
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
        String moduleContent = getContentFromModule(entry);

        if (moduleContent != null) {
            return moduleContent;
        }

        List<Content> contents = entry.getContents();

        if (!contents.isEmpty()) {
            Content content = contents.get(0);
            if (StringUtils.isNotBlank(content.getValue())) {
                return content.getValue();
            }
        }

        return null;
    }

    static String getContent(Item item) {
        String moduleContent = getContentFromModule(item);

        if (moduleContent != null) {
            return moduleContent;
        }

        final Description description = item.getDescription();
        return description == null ? null : description.getValue();
    }

    private static String getContentFromModule(Extendable extendable) {
        Module module = extendable.getModule(ContentModule.URI);

        if (module instanceof ContentModule) {
            ContentModule content = (ContentModule) module;
            if (content.getContents() != null && !content.getContents().isEmpty()) {
                return content.getContents().get(0);
            }

        }

        return null;
    }
}
