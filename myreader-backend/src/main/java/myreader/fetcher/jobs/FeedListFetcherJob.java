package myreader.fetcher.jobs;

import com.google.common.collect.Iterators;
import myreader.fetcher.FeedParser;
import myreader.fetcher.FeedQueue;
import myreader.repository.SubscriptionRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

import static java.lang.System.Logger.Level.DEBUG;
import static java.lang.System.Logger.Level.ERROR;
import static java.lang.System.Logger.Level.INFO;
import static java.util.Objects.requireNonNull;

@Component
@ConditionalOnTaskEnabled
public class FeedListFetcherJob extends BaseJob {

  private final FeedQueue feedQueue;
  private final SubscriptionRepository subscriptionRepository;
  private final FeedParser feedParser;

  public FeedListFetcherJob(
    FeedQueue feedQueue,
    SubscriptionRepository subscriptionRepository,
    FeedParser feedParser
  ) {
    super("syndFetcherJob");
    this.feedParser = requireNonNull(feedParser, "feedParser is null");
    this.feedQueue = requireNonNull(feedQueue, "feedQueue is null");
    this.subscriptionRepository = requireNonNull(subscriptionRepository, "subscriptionRepository is null");
  }

  @Scheduled(fixedRate = 300000)
  @Override
  public void work() {
    var subscriptions = subscriptionRepository.findAll();

    var iterator = subscriptions.iterator();
    var size = Iterators.size(subscriptions.iterator());
    logger.log(INFO, "checking {0} subscriptions", size);

    for (var i = 0; i < size && isAlive(); i++) {
      var subscription = iterator.next();

      try {
        feedParser.parse(subscription.getUrl(), subscription.getLastModified()).ifPresent(feedQueue::add);
        logger.log(DEBUG, "{0}/{1} lastModified: {2}, url: {3}", i + 1, size, subscription.getLastModified(), subscription.getUrl());
      } catch (Exception exception) {
        subscriptionRepository.saveLastErrorMessage(subscription.getId(), exception.getMessage(), OffsetDateTime.now());
        logger.log(ERROR, "url: {0}, message: {1}", subscription.getUrl(), exception.getMessage());
      }
    }
  }
}
