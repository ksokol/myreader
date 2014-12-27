package myreader.fetcher.jobs;

import java.util.Iterator;
import java.util.List;

import myreader.entity.Feed;
import myreader.fetcher.FeedQueue;
import myreader.fetcher.impl.HttpCallDecisionMaker;
import myreader.repository.FeedRepository;

/**
 * @author Kamill Sokol
 */
public class FeedListFetcherJob extends BaseJob {

    private final HttpCallDecisionMaker httpCallDecisionMaker;
    private final FeedQueue feedQueue;
    private final FeedRepository feedRepository;

    public FeedListFetcherJob(HttpCallDecisionMaker httpCallDecisionMaker, FeedQueue feedQueue, FeedRepository feedRepository) {
        super("syndFetcherJob");
        this.httpCallDecisionMaker = httpCallDecisionMaker;
        this.feedQueue = feedQueue;
        this.feedRepository = feedRepository;
    }

    @Override
    public void work() {
        if (feedQueue.getSize() > 0) {
            log.info("queue has {} feeds. aborting", feedQueue.getSize());
            return;
        }

        List<Feed> feeds = feedRepository.findAll();
        Iterator<Feed> iterator = feeds.iterator();
        int count = 0;
        int size = feeds.size();
        log.info("checking {} feeds", size);

        for(int i=0;i<size && alive;i++) {
            Feed f = iterator.next();
            boolean result = httpCallDecisionMaker.decide(f.getUrl(), f.getLastModified());
            log.debug("{}/{} call: {}, lastModified: {}, url: {}", new Object[]{i+1, size, result, f.getLastModified(), f.getUrl()});

            if (result) {
                count++;
                feedQueue.add(f.getUrl());
            }
        }

        if(alive) {
            log.info("{} new elements in queue", count);
        } else {
            log.info("{} feeds left for check but got stop signal", size - count);
        }
    }
}
