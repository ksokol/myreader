package myreader.fetcher.jobs;

import myreader.fetcher.FeedQueue;
import myreader.fetcher.SubscriptionBatch;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import static java.lang.System.Logger.Level.ERROR;
import static java.util.Objects.requireNonNull;

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
  @Override
  public void work() {
    var fetchResult = feedQueue.take();

    while (fetchResult != null && isAlive()) {
      try {
        subscriptionBatchService.update(fetchResult);
      } catch (Exception exception) {
        getLogger().log(ERROR, "error during subscription update for {0}", fetchResult.getUrl(), exception);
      }
      fetchResult = feedQueue.take();
    }
  }
}
