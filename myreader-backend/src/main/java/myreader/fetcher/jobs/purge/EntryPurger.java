package myreader.fetcher.jobs.purge;

import myreader.repository.SubscriptionEntryRepository;
import org.springframework.stereotype.Component;

import java.lang.System.Logger;
import java.time.OffsetDateTime;
import java.util.Objects;

import static java.lang.System.Logger.Level.INFO;

@Component
public class EntryPurger {

  private static final Logger logger = System.getLogger(EntryPurger.class.getName());

  private final SubscriptionEntryRepository subscriptionEntryRepository;

  public EntryPurger(SubscriptionEntryRepository subscriptionEntryRepository) {
    this.subscriptionEntryRepository = Objects.requireNonNull(subscriptionEntryRepository, "subscriptionEntryRepository is null");
  }

  public void purge(Long subscriptionId, OffsetDateTime retainAfterDate) {
    logger.log(INFO, "retaining feed entries after {0} for feed {1}", retainAfterDate, subscriptionId.toString());

    var entries = subscriptionEntryRepository.findAllIdsBySubscriptionIdAndTagsIsEmptyAndCreatedAtIsLowerThan(
      subscriptionId,
      retainAfterDate
    );

    logger.log(INFO, "deleting {0} entries from subscription {1}", entries.size(), subscriptionId.toString());

    for (var feedEntry : entries) {
      subscriptionEntryRepository.deleteById(feedEntry);
    }
  }
}
