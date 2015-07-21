package myreader.fetcher.converter;

import com.rometools.rome.feed.atom.Content;
import com.rometools.rome.feed.atom.Entry;
import com.rometools.rome.feed.atom.Feed;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.convert.converter.Converter;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * @author Kamill Sokol
 */
public class AtomConverter implements Converter<Feed, FetchResult> {

    private final int maxSize;

    public AtomConverter(final int maxSize) {
        Assert.isTrue(maxSize > 0, "maxSize has to be greater than 0");
        this.maxSize = maxSize;
    }

    @Override
    public FetchResult convert(final Feed source) {
        final List<Entry> items = source.getEntries();
        List<FetcherEntry> entries = new ArrayList<>();
        int i = 0;

        for (Entry e : items) {
            i++;
            FetcherEntry dto = new FetcherEntry();

            dto.setGuid(e.getId());
            dto.setTitle(e.getTitle());
            dto.setUrl(e.getId());

            final List<Content> contents1 = e.getContents();

            if (CollectionUtils.isNotEmpty(contents1)) {
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
        return new FetchResult(entries, null, source.getTitle());
    }
}
