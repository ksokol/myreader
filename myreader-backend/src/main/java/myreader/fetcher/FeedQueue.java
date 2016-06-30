package myreader.fetcher;

import myreader.fetcher.persistence.FetchResult;

import java.util.List;

/**
 * @author Kamill Sokol
 */
public interface FeedQueue {

    void add(FetchResult fetchResult);

    int getSize();

    FetchResult take();

    List<String> getSnapshot();
}
