package myreader.fetcher;

import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.repository.ExclusionRepository;
import myreader.repository.FeedEntryRepository;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

@Component
public class SubscriptionEntryBatch {

  private final ExclusionChecker exclusionChecker = new ExclusionChecker();

  private final FeedEntryRepository feedEntryRepository;
  private final SubscriptionRepository subscriptionRepository;
  private final SubscriptionEntryRepository subscriptionEntryRepository;
  private final ExclusionRepository exclusionRepository;
  private final Clock clock;

  public SubscriptionEntryBatch(
    FeedEntryRepository feedEntryRepository,
    SubscriptionRepository subscriptionRepository,
    SubscriptionEntryRepository subscriptionEntryRepository,
    ExclusionRepository exclusionRepository,
    Clock clock
  ) {
    this.feedEntryRepository = feedEntryRepository;
    this.subscriptionRepository = subscriptionRepository;
    this.subscriptionEntryRepository = subscriptionEntryRepository;
    this.exclusionRepository = exclusionRepository;
    this.clock = clock;
  }

  public void updateUserSubscriptionEntries() {
    var subscriptions = subscriptionRepository.findAll();

    for (var subscription : subscriptions) {
      Slice<FeedEntry> slice;

      if (subscription.getLastFeedEntryId() == null) {
        slice = feedEntryRepository.findBySubscriptionId(
          subscription.getId(),
          PageRequest.of(0, 10)
        );
      } else {
        slice = feedEntryRepository.findByGreaterThanFeedEntryId(
          subscription.getLastFeedEntryId(),
          subscription.getId(),
          PageRequest.of(0, 10)
        );
      }

      do {
        for (var entry : slice.getContent()) {
          process(subscription, entry);
        }

        if (slice.hasNext()) {
          slice = feedEntryRepository.findByGreaterThanFeedEntryId(
            subscription.getLastFeedEntryId(),
            subscription.getId(),
            slice.nextPageable()
          );
        }
      } while (slice.hasNext());
    }
  }

  @Transactional
  public void process(Subscription subscription, FeedEntry feedEntry) {
    if (subscriptionEntryRepository.contains(feedEntry.getId(), subscription.getId())) {
      subscriptionRepository.updateLastFeedEntryId(feedEntry.getId(), subscription.getId());
      return;
    }

    var exclusions = exclusionRepository.findBySubscriptionId(subscription.getId());

    for (var exclusionPattern : exclusions) {
      final boolean excluded = exclusionChecker.isExcluded(
        exclusionPattern.getPattern(),
        feedEntry.getTitle(),
        feedEntry.getContent(),
        feedEntry.getUrl()
      );

      if (excluded) {
        exclusionRepository.incrementHitCount(exclusionPattern.getId());
        subscriptionRepository.updateLastFeedEntryId(feedEntry.getId(), subscription.getId());
        return;
      }
    }

    var subscriptionEntry = new SubscriptionEntry();
    subscriptionEntry.setFeedEntry(feedEntry);
    subscriptionEntry.setSubscription(subscription);
    subscriptionEntry.setCreatedAt(now());

    subscriptionEntryRepository.save(subscriptionEntry);
    subscriptionRepository.updateLastFeedEntryIdAndIncrementFetchCount(feedEntry.getId(), subscription.getId());
  }

  private Date now() {
    return Date.from(LocalDateTime.now(clock).toInstant(ZoneOffset.UTC));
  }
}
