package myreader.fetcher.converter;

import com.rometools.rome.feed.rss.Channel;
import com.rometools.rome.feed.rss.Item;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.springframework.http.HttpHeaders.LAST_MODIFIED;

/**
 * @author Kamill Sokol
 */
final class ChannelConverter {

    private final int maxSize;

    ChannelConverter(final int maxSize) {
        if (maxSize < 1) {
            throw new IllegalArgumentException("maxSize has to be greater than 0");
        }
        this.maxSize = maxSize;
    }

    FetchResult convert(final String feedUrl, final ResponseEntity<Channel> source) {
        Channel body = source.getBody();

        if (body == null) {
            return new FetchResult(feedUrl);
        }

        List<Item> items = body.getItems();
        List<FetcherEntry> entries = new ArrayList<>();

        for (int i = 0; i < items.size() && i < maxSize; i++) {
            Item item = items.get(i);
            FetcherEntry fetcherEntry = new FetcherEntry();

            fetcherEntry.setGuid(item.getLink());
            fetcherEntry.setTitle(item.getTitle());
            fetcherEntry.setUrl(item.getLink());
            fetcherEntry.setFeedUrl(feedUrl);
            fetcherEntry.setContent(ContentUtil.getContent(item));

            entries.add(fetcherEntry);
        }

        Collections.reverse(entries);

        String lastModified = source.getHeaders().getFirst(LAST_MODIFIED);
        return new FetchResult(entries, lastModified, body.getTitle(), feedUrl, items.size());
    }
}
