package myreader.fetcher;

import myreader.fetcher.persistence.FetchResult;

/**
 * @author Kamill Sokol
 */
public interface FeedQueue {

    void add(FetchResult fetchResult);

    int getSize();

    FetchResult take();
}
