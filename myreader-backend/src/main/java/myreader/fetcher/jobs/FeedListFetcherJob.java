package myreader.fetcher.jobs;

import myreader.entity.Feed;
import myreader.fetcher.FeedParser;
import myreader.fetcher.FeedQueue;
import myreader.fetcher.persistence.FetchResult;
import myreader.repository.FeedRepository;

import java.util.Iterator;
import java.util.List;

/**
 * @author Kamill Sokol
 */
public class FeedListFetcherJob extends BaseJob {

    private final FeedQueue feedQueue;
    private final FeedRepository feedRepository;
    private final FeedParser feedParser;

    public FeedListFetcherJob(FeedQueue feedQueue, FeedRepository feedRepository, FeedParser feedParser) {
        super("syndFetcherJob");
        this.feedParser = feedParser;
        this.feedQueue = feedQueue;
        this.feedRepository = feedRepository;
    }

    @Override
    public void work() {
        List<Feed> feeds = feedRepository.findAll();
        Iterator<Feed> iterator = feeds.iterator();
        int size = feeds.size();
        log.info("checking {} feeds", size);

        for(int i=0;i<size && alive;i++) {
            Feed f = iterator.next();

            try {
                FetchResult fetchResult = feedParser.parse(f.getUrl(), f.getLastModified());
                log.debug("{}/{} lastModified: {}, url: {}", i + 1, size, f.getLastModified(), f.getUrl());
                feedQueue.add(fetchResult);
            } catch(Exception exception) {
                log.error(exception.getMessage(), exception);
            }
        }
    }
}
