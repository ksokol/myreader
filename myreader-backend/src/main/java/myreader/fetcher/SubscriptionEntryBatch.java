package myreader.fetcher;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.ExclusionRepository;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class SubscriptionEntryBatch {

  private final ExclusionChecker exclusionChecker = new ExclusionChecker();

  private final SubscriptionRepository subscriptionRepository;
  private final SubscriptionEntryRepository subscriptionEntryRepository;
  private final ExclusionRepository exclusionRepository;

  public SubscriptionEntryBatch(
    SubscriptionRepository subscriptionRepository,
    SubscriptionEntryRepository subscriptionEntryRepository,
    ExclusionRepository exclusionRepository
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.subscriptionEntryRepository = subscriptionEntryRepository;
    this.exclusionRepository = exclusionRepository;
  }

  @Transactional
  public void update(Subscription subscription, FetcherEntry fetcherEntry) {
    var exclusions = exclusionRepository.findBySubscriptionId(subscription.getId());
    var excluded = false;

    for (var exclusionPattern : exclusions) {
      excluded = exclusionChecker.isExcluded(
        exclusionPattern.getPattern(),
        fetcherEntry.getTitle(),
        fetcherEntry.getContent(),
        fetcherEntry.getUrl()
      );

      if (excluded) {
        exclusionRepository.incrementHitCount(exclusionPattern.getId());
        break;
      }
    }

    var subscriptionEntry = new SubscriptionEntry(subscription);
    subscriptionEntry.setContent(fetcherEntry.getContent());
    subscriptionEntry.setGuid(fetcherEntry.getGuid());
    subscriptionEntry.setTitle(fetcherEntry.getTitle());
    subscriptionEntry.setUrl(fetcherEntry.getUrl());
    subscriptionEntry.setExcluded(excluded);

    subscriptionEntryRepository.save(subscriptionEntry);

    if (!excluded) {
      subscriptionRepository.incrementFetchCount(subscription.getId());
    }
  }
}
