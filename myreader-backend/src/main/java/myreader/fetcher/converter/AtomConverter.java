package myreader.fetcher.converter;

import com.rometools.rome.feed.atom.Content;
import com.rometools.rome.feed.atom.Entry;
import com.rometools.rome.feed.atom.Feed;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.springframework.http.HttpHeaders.LAST_MODIFIED;

/**
 * @author Kamill Sokol
 */
final class AtomConverter {

    private final int maxSize;

    public AtomConverter(final int maxSize) {
        Assert.isTrue(maxSize > 0, "maxSize has to be greater than 0");
        this.maxSize = maxSize;
    }

    public FetchResult convert(final String feedUrl, final ResponseEntity<Feed> source) {
        final List<Entry> items = source.getBody().getEntries();
        List<FetcherEntry> entries = new ArrayList<>();
        int i = 0;

        for (Entry e : items) {
            i++;
            FetcherEntry dto = new FetcherEntry();

            dto.setGuid(e.getId());
            dto.setTitle(e.getTitle());
            dto.setUrl(e.getAlternateLinks().get(0).getHref());
            dto.setFeedUrl(feedUrl);

            final List<Content> contents1 = e.getContents();

            if (!contents1.isEmpty()) {
                Content contents = contents1.get(0);
                if(StringUtils.isNotBlank(contents.getValue())) {
                    dto.setContent(contents.getValue());
                }
            }

            entries.add(dto);
            if (i == maxSize) {
                break;
            }
        }

        Collections.reverse(entries);

        final String lastModified = source.getHeaders().getFirst(LAST_MODIFIED);
        return new FetchResult(entries, lastModified, source.getBody().getTitle(), feedUrl, items.size());
    }
}
