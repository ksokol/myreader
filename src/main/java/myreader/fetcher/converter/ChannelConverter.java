package myreader.fetcher.converter;

import static org.springframework.http.HttpHeaders.LAST_MODIFIED;

import com.rometools.rome.feed.rss.Channel;
import com.rometools.rome.feed.rss.Description;
import com.rometools.rome.feed.rss.Item;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * @author Kamill Sokol
 */
final class ChannelConverter {

    private final int maxSize;

    public ChannelConverter(final int maxSize) {
        Assert.isTrue(maxSize > 0, "maxSize has to be greater than 0");
        this.maxSize = maxSize;
    }

    public FetchResult convert(final String feedUrl, final ResponseEntity<Channel> source) {
        final List<Item> items = source.getBody().getItems();
        List<FetcherEntry> entries = new ArrayList<>();
        int i = 0;

        for (Item e : items) {
            i++;
            FetcherEntry dto = new FetcherEntry();

            dto.setGuid(e.getLink());
            dto.setTitle(e.getTitle());
            dto.setUrl(e.getLink());
            dto.setFeedUrl(feedUrl);

            final Description description = e.getDescription();
            String content = description == null ? null : description.getValue();

            dto.setContent(content);

            entries.add(dto);
            if (i == maxSize) {
                break;
            }
        }

        Collections.reverse(entries);

        final String lastModified = source.getHeaders().getFirst(LAST_MODIFIED);
        return new FetchResult(entries, lastModified, source.getBody().getTitle());
    }
}
