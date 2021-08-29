package myreader.fetcher.jobs.purge;

import myreader.entity.Subscription;
import myreader.repository.SubscriptionEntryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Objects;
import java.util.Optional;

@Component
public class RetainDateDeterminer {

  private static final Logger log = LoggerFactory.getLogger(RetainDateDeterminer.class);

  private final SubscriptionEntryRepository subscriptionEntryRepository;
  private final int minFeedThreshold;

  public RetainDateDeterminer(
    SubscriptionEntryRepository subscriptionEntryRepository,
    @Value("${myreader.min-feed-threshold:50}") int minFeedThreshold
  ) {
    this.subscriptionEntryRepository = Objects.requireNonNull(subscriptionEntryRepository, "subscriptionEntryRepository is null");
    this.minFeedThreshold = minFeedThreshold;
  }

  public Optional<OffsetDateTime> determine(Subscription subscription) {
    var entryCount = subscriptionEntryRepository.countBySubscriptionId(subscription.getId());
    var feedThreshold = Math.max(subscription.getResultSizePerFetch(), minFeedThreshold);

    if (feedThreshold >= entryCount) {
      log.info(
        "skipping. threshold of {} entries not reached for feed '{} ({})' (actual {})",
        feedThreshold,
        subscription.getTitle(),
        subscription.getId(),
        entryCount
      );
      return Optional.empty();
    }

    var entries = subscriptionEntryRepository.findAllBySubscriptionIdOrderByCreatedAtDesc(
      subscription.getId(),
      feedThreshold
    );

    if (entries.isEmpty()) {
      return Optional.empty();
    }

    var lastFeedEntry = entries.get(entries.size() - 1);
    var retainDate = lastFeedEntry.getCreatedAt()
      .toInstant()
      .atZone(ZoneOffset.UTC)
      .toOffsetDateTime();
    return Optional.of(retainDate);
  }
}
