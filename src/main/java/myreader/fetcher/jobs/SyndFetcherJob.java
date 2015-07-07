package myreader.fetcher.jobs;

import myreader.fetcher.FeedQueue;
import myreader.fetcher.SubscriptionBatch;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

/**
 * @author Kamill Sokol
 */
public class SyndFetcherJob extends BaseJob {

    private final FeedQueue feedQueue;
    private final SubscriptionBatch subscriptionBatchService;

    public SyndFetcherJob(String jobName, FeedQueue feedQueue, SubscriptionBatch subscriptionBatchService) {
        super(jobName);
        Assert.notNull(feedQueue);
        Assert.notNull(subscriptionBatchService);
        this.feedQueue = feedQueue;
        this.subscriptionBatchService = subscriptionBatchService;
    }

    @Transactional
    @Override
    public void work() {
        String feedUrl;

        while ((feedUrl = feedQueue.poll()) != null && alive) {
            try {
                subscriptionBatchService.updateUserSubscriptions(feedUrl);
            } catch(Exception e) {
                log.error("error during subscription update for {}", feedUrl, e);
            }
        }
    }

}
