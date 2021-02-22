package myreader.fetcher.jobs;

import com.google.common.collect.Iterators;
import myreader.entity.Subscription;
import myreader.fetcher.FeedParser;
import myreader.fetcher.FeedQueue;
import myreader.repository.SubscriptionRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import static java.util.Objects.requireNonNull;

@Component
@ConditionalOnTaskEnabled
public class FeedListFetcherJob extends BaseJob {

  private final FeedQueue feedQueue;
  private final SubscriptionRepository subscriptionRepository;
  private final FeedParser feedParser;

  public FeedListFetcherJob(FeedQueue feedQueue, SubscriptionRepository subscriptionRepository, FeedParser feedParser) {
    super("syndFetcherJob");
    this.feedParser = requireNonNull(feedParser, "feedParser is null");
    this.feedQueue = requireNonNull(feedQueue, "feedQueue is null");
    this.subscriptionRepository = requireNonNull(subscriptionRepository, "subscriptionRepository is null");
  }

  @Scheduled(fixedRate = 300000)
  @Override
  public void work() {
    var feeds = subscriptionRepository.findAll();
    var iterator = feeds.iterator();
    var size = Iterators.size(feeds.iterator());
    getLog().info("checking {} subscriptions", size);

    for (var i = 0; i < size && isAlive(); i++) {
      Subscription subscription = iterator.next();

      try {
        feedParser.parse(subscription.getUrl(), subscription.getLastModified()).ifPresent(feedQueue::add);
        getLog().debug("{}/{} lastModified: {}, url: {}", i + 1, size, subscription.getLastModified(), subscription.getUrl());
      } catch (Exception exception) {
        getLog().error(exception.getMessage(), exception);
      }
    }
  }
}
