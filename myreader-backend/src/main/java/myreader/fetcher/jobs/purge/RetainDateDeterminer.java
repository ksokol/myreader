package myreader.fetcher.jobs.purge;

import myreader.entity.Subscription;
import myreader.repository.SubscriptionEntryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.Date;
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
    this.subscriptionEntryRepository = subscriptionEntryRepository;
    this.minFeedThreshold = minFeedThreshold;
  }

  public Optional<Date> determine(Subscription subscription) {
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

    var page = subscriptionEntryRepository.findBySubscriptionIdOrderByCreatedAtDesc(
      subscription.getId(),
      PageRequest.of(0, feedThreshold)
    );

    if (page.getTotalElements() == 0) {
      return Optional.empty();
    }

    var lastFeedEntry = page.getContent().get(page.getContent().size() - 1);
    return Optional.of(lastFeedEntry.getCreatedAt());
  }
}
