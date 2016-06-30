package myreader.fetcher;

import myreader.fetcher.persistence.FetchResult;

/**
 * @author Kamill Sokol
 */
public interface FeedParser {
    FetchResult parse(String feedUrl);

    FetchResult parse(String feedUrl, String lastModified);
}
