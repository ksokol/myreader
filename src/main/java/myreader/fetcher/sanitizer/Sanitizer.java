package myreader.fetcher.sanitizer;

import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import org.apache.commons.collections.CollectionUtils;

/**
 * @author Kamill Sokol
 */
public final class Sanitizer {

    public static void sanitize(FetchResult fetchResult) {
        if(fetchResult == null) {
            return;
        }
        if(CollectionUtils.isEmpty(fetchResult.getEntries())) {
            return;
        }

        for (final FetcherEntry fetcherEntry : fetchResult.getEntries()) {
            fetcherEntry.setTitle(StringDecoder.escapeSimpleHtml(fetcherEntry.getTitle()));
            fetcherEntry.setUrl(EntryLinkSanitizer.sanitize(fetcherEntry.getUrl(), fetchResult.getUrl()));
            fetcherEntry.setContent(StringDecoder.escapeHtmlContent(fetcherEntry.getContent(), fetcherEntry.getUrl()));
        }
    }
}
