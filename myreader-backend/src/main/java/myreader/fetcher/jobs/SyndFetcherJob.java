package myreader.fetcher.jobs;

import myreader.fetcher.FeedQueue;
import myreader.fetcher.SubscriptionBatch;
import myreader.fetcher.persistence.FetchResult;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import static java.util.Objects.requireNonNull;

/**
 * @author Kamill Sokol
 */
@ConditionalOnTaskEnabled
@Component
public class SyndFetcherJob extends BaseJob {

    private final FeedQueue feedQueue;
    private final SubscriptionBatch subscriptionBatchService;

    public SyndFetcherJob(FeedQueue feedQueue, SubscriptionBatch subscriptionBatchService) {
        super("syndFetcher");
        this.feedQueue = requireNonNull(feedQueue, "feedQueue is null");
        this.subscriptionBatchService = requireNonNull(subscriptionBatchService, "subscriptionBatchService is null");
    }

    @Scheduled(fixedRate = 300000)
    @Transactional
    @Override
    public void work() {
        FetchResult fetchResult;

        while ((fetchResult = feedQueue.take()) != null) {
            if (!isAlive()) {
                return;
            }
            try {
                subscriptionBatchService.updateUserSubscriptions(fetchResult);
            } catch(Exception e) {
                getLog().error("error during subscription update for {}", fetchResult.getUrl(), e);
            }
        }
    }
}
