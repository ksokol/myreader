package myreader.fetcher.converter;

import com.rometools.rome.feed.rss.Channel;
import com.rometools.rome.feed.rss.Description;
import com.rometools.rome.feed.rss.Item;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import org.springframework.core.convert.converter.Converter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * @author Kamill Sokol
 */
public class ChannelConverter implements Converter<Channel, FetchResult> {

    private int maxSize = 10;

    @Override
    public FetchResult convert(final Channel source) {
        final List<Item> items = source.getItems();
        List<FetcherEntry> entries = new ArrayList<>();
        int i = 0;

        for (Item e : items) {
            i++;
            FetcherEntry dto = new FetcherEntry();

            dto.setGuid(e.getLink());
            dto.setTitle(e.getTitle());

            dto.setUrl(e.getLink());

            final Description description = e.getDescription();
            String content = description == null ? null : description.getValue();

            dto.setContent(content);

            entries.add(dto);
            if (i == maxSize) {
                break;
            }
        }

        Collections.reverse(entries);
        return new FetchResult(entries, null, source.getTitle());


    }
}
