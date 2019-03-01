package myreader.fetcher.converter;

import com.rometools.rome.feed.atom.Entry;
import com.rometools.rome.feed.atom.Feed;
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
final class AtomConverter {

    private final int maxSize;

    AtomConverter(final int maxSize) {
        if (maxSize < 1) {
            throw new IllegalArgumentException("maxSize has to be greater than 0");
        }
        this.maxSize = maxSize;
    }

    FetchResult convert(final String feedUrl, final ResponseEntity<Feed> source) {
        Feed body = source.getBody();
        if (body == null) {
            return new FetchResult(feedUrl);
        }

        List<Entry> items = body.getEntries();
        List<FetcherEntry> entries = new ArrayList<>();

        for (int i = 0; i < items.size() && i < maxSize; i++) {
            Entry entry = items.get(i);
            FetcherEntry fetcherEntry = new FetcherEntry();

            fetcherEntry.setGuid(entry.getId());
            fetcherEntry.setTitle(entry.getTitle());
            fetcherEntry.setUrl(entry.getAlternateLinks().get(0).getHref());
            fetcherEntry.setFeedUrl(feedUrl);
            fetcherEntry.setContent(ContentUtil.getContent(entry));

            entries.add(fetcherEntry);
        }

        Collections.reverse(entries);

        String lastModified = source.getHeaders().getFirst(LAST_MODIFIED);
        return new FetchResult(entries, lastModified, body.getTitle(), feedUrl, items.size());
    }
}
