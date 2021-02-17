package myreader.fetcher.jobs.purge;

import myreader.repository.SubscriptionEntryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class EntryPurger {

  private static final Logger log = LoggerFactory.getLogger(EntryPurger.class);

  private final SubscriptionEntryRepository subscriptionEntryRepository;
  private final int pageSize;

  public EntryPurger(SubscriptionEntryRepository subscriptionEntryRepository, @Value("${myreader.entry-purger.page-size:1000}") int pageSize) {
    this.subscriptionEntryRepository = subscriptionEntryRepository;
    this.pageSize = pageSize;
  }

  public void purge(Long feedId, Date retainAfterDate) {
    log.info("retaining feed entries after {} for feed {}", retainAfterDate, feedId);

    var pageRequest = PageRequest.of(0, pageSize);
    var feedEntries = subscriptionEntryRepository.findAllIdsBySubscriptionIdAndTagsIsEmptyAndCreatedAt(
      feedId,
      retainAfterDate,
      pageRequest
    );

    while (!feedEntries.getContent().isEmpty()) {
      log.info("{} elements left for deletion for feed {}", feedEntries.getTotalElements(), feedId);

      for (var feedEntry : feedEntries) {
        subscriptionEntryRepository.deleteById(feedEntry);
      }

      feedEntries = subscriptionEntryRepository.findAllIdsBySubscriptionIdAndTagsIsEmptyAndCreatedAt(
        feedId,
        retainAfterDate,
        pageRequest
      );
    }
  }
}
