package myreader.fetcher.jobs;

import myreader.entity.Feed;
import myreader.fetcher.FeedParser;
import myreader.fetcher.FeedQueue;
import myreader.fetcher.persistence.FetchResult;
import myreader.repository.FeedRepository;
import org.apache.commons.collections.CollectionUtils;

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
        if (feedQueue.getSize() > 0) {
            log.info("queue has {} feeds. aborting", feedQueue.getSize());
            return;
        }

        List<Feed> feeds = feedRepository.findAll();
        Iterator<Feed> iterator = feeds.iterator();
        int size = feeds.size();
        log.info("checking {} feeds", size);

        for(int i=0;i<size && alive;i++) {
            Feed f = iterator.next();
            FetchResult fetchResult;

            try {
                fetchResult = feedParser.parse(f.getUrl(), f.getLastModified());
            } catch(Exception e) {
                continue;
            }

            final boolean result = CollectionUtils.isNotEmpty(fetchResult.getEntries());
            log.debug("{}/{} call: {}, lastModified: {}, url: {}", new Object[]{i + 1, size, result, f.getLastModified(), f.getUrl()});

            if (result) {
                feedQueue.add(fetchResult);
            }
        }
    }
}
