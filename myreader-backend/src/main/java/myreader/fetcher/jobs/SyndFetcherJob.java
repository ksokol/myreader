package myreader.fetcher.jobs;

import myreader.fetcher.FeedQueue;
import myreader.fetcher.SubscriptionBatch;

import myreader.fetcher.persistence.FetchResult;
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
        FetchResult fetchResult;

        while ((fetchResult = feedQueue.poll()) != null && alive) {
            try {
                subscriptionBatchService.updateUserSubscriptions(fetchResult);
            } catch(Exception e) {
                log.error("error during subscription update for {}", fetchResult.getUrl(), e);
            }
        }
    }

}
