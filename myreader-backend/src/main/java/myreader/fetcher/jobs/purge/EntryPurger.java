package myreader.fetcher.jobs.purge;

import myreader.repository.SubscriptionEntryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Objects;

@Component
public class EntryPurger {

  private static final Logger log = LoggerFactory.getLogger(EntryPurger.class);

  private final SubscriptionEntryRepository subscriptionEntryRepository;

  public EntryPurger(SubscriptionEntryRepository subscriptionEntryRepository) {
    this.subscriptionEntryRepository = Objects.requireNonNull(subscriptionEntryRepository, "subscriptionEntryRepository is null");
  }

  public void purge(Long subscriptionId, Date retainAfterDate) {
    log.info("retaining feed entries after {} for feed {}", retainAfterDate, subscriptionId);

    var entries = subscriptionEntryRepository.findAllIdsBySubscriptionIdAndTagsIsEmptyAndCreatedAtIsLowerThan(
      subscriptionId,
      retainAfterDate
    );

    log.info("deleting {} entries from subscription {}", entries.size(), subscriptionId);

    for (var feedEntry : entries) {
      subscriptionEntryRepository.deleteById(feedEntry);
    }
  }
}
