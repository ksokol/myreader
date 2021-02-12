package myreader.fetcher;

import myreader.fetcher.persistence.FetchResult;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class SubscriptionBatch {

  private final SubscriptionRepository subscriptionRepository;
  private final SubscriptionEntryRepository subscriptionEntryRepository;
  private final SubscriptionEntryBatch subscriptionEntryBatch;

  public SubscriptionBatch(
    SubscriptionRepository subscriptionRepository,
    SubscriptionEntryRepository subscriptionEntryRepository,
    SubscriptionEntryBatch subscriptionEntryBatch
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.subscriptionEntryRepository = subscriptionEntryRepository;
    this.subscriptionEntryBatch = subscriptionEntryBatch;
  }

  @Transactional
  public void update(FetchResult fetchResult) {
    subscriptionRepository.findByUrl(fetchResult.getUrl()).ifPresent(subscription -> {
      var newCount = 0;

      for (var fetcherEntry : fetchResult.getEntries()) {
        var result = subscriptionEntryRepository.countByTitleOrGuidOrUrlAndSubscriptionId(
          fetcherEntry.getTitle(),
          fetcherEntry.getGuid(),
          fetcherEntry.getUrl(),
          subscription.getId()
        );

        if (result == 0) {
          subscriptionEntryBatch.update(subscription, fetcherEntry);
          newCount++;
        }
      }

      subscription.setLastModified(fetchResult.getLastModified());
      subscription.setFetched(subscription.getFetched() + newCount);

      if (fetchResult.getResultSizePerFetch() > 0) {
        subscription.setResultSizePerFetch(fetchResult.getResultSizePerFetch());
      }

      subscriptionRepository.save(subscription);
    });
  }
}
