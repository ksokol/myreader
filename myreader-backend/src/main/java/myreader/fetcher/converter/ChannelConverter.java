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

    ChannelConverter(final int maxSize) {
        Assert.isTrue(maxSize > 0, "maxSize has to be greater than 0");
        this.maxSize = maxSize;
    }

    FetchResult convert(final String feedUrl, final ResponseEntity<Channel> source) {
        Channel body = source.getBody();

        if (body == null) {
            return new FetchResult(feedUrl);
        }

        final List<Item> items = body.getItems();
        List<FetcherEntry> entries = new ArrayList<>();
        int i = 0;

        for (Item entry : items) {
            i++;
            FetcherEntry fetcherEntry = new FetcherEntry();

            fetcherEntry.setGuid(entry.getLink());
            fetcherEntry.setTitle(entry.getTitle());
            fetcherEntry.setUrl(entry.getLink());
            fetcherEntry.setFeedUrl(feedUrl);
            fetcherEntry.setContent(ContentUtil.getContent(entry));

            entries.add(fetcherEntry);

            if (i == maxSize) {
                break;
            }
        }

        Collections.reverse(entries);

        final String lastModified = source.getHeaders().getFirst(LAST_MODIFIED);
        return new FetchResult(entries, lastModified, body.getTitle(), feedUrl, items.size());
    }
}
