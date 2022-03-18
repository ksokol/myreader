package myreader.fetcher.jobs;

import com.google.common.collect.Iterators;
import myreader.entity.FetchError;
import myreader.fetcher.FeedParser;
import myreader.fetcher.FeedQueue;
import myreader.repository.FetchErrorRepository;
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
  private final FetchErrorRepository fetchErrorRepository;

  public FeedListFetcherJob(
    FeedQueue feedQueue,
    SubscriptionRepository subscriptionRepository,
    FeedParser feedParser,
    FetchErrorRepository fetchErrorRepository
  ) {
    super("syndFetcherJob");
    this.feedParser = requireNonNull(feedParser, "feedParser is null");
    this.feedQueue = requireNonNull(feedQueue, "feedQueue is null");
    this.subscriptionRepository = requireNonNull(subscriptionRepository, "subscriptionRepository is null");
    this.fetchErrorRepository = requireNonNull(fetchErrorRepository, "fetchErrorRepository is null");
  }

  @Scheduled(fixedRate = 300000)
  @Override
  public void work() {
    var feeds = subscriptionRepository.findAll();
    var iterator = feeds.iterator();
    var size = Iterators.size(feeds.iterator());
    getLogger().log(INFO, "checking {0} subscriptions", size);

    for (var i = 0; i < size && isAlive(); i++) {
      var subscription = iterator.next();

      try {
        feedParser.parse(subscription.getUrl(), subscription.getLastModified()).ifPresent(feedQueue::add);
        getLogger().log(DEBUG, "{0}/{1} lastModified: {2}, url: {3}", i + 1, size, subscription.getLastModified(), subscription.getUrl());
      } catch (Exception exception) {
        fetchErrorRepository.save(new FetchError(subscription.getId(), exception.getMessage(), OffsetDateTime.now()));
        getLogger().log(ERROR, "url: {0}, message: {1}", subscription.getUrl(), exception.getMessage());
      }
    }
  }
}
