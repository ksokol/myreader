package myreader.fetcher;

import myreader.entity.ExclusionPattern;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.repository.ExclusionRepository;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.service.time.TimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author Kamill Sokol
 */
@Component
@Transactional
public class SubscriptionEntryBatch {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final ExclusionRepository exclusionRepository;
    private final TimeService timeService;
    private ExclusionChecker exclusionChecker = new ExclusionChecker();

    @Autowired
    public SubscriptionEntryBatch(SubscriptionRepository subscriptionRepository, SubscriptionEntryRepository subscriptionEntryRepository, ExclusionRepository exclusionRepository, TimeService timeService) {
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.exclusionRepository = exclusionRepository;
        this.timeService = timeService;
    }

    public void updateUserSubscriptionEntries(FeedEntry feedEntry) {
        List<Subscription> subscriptionList = subscriptionRepository.findByUrl(feedEntry.getFeed().getUrl());

        for (Subscription subscription : subscriptionList) {
            boolean excluded = false;

            for (ExclusionPattern ep : exclusionRepository.findBySubscriptionId(subscription.getId())) {
                excluded = exclusionChecker.isExcluded(ep.getPattern(), feedEntry.getTitle(), feedEntry.getContent());

                if (excluded) {
                    exclusionRepository.incrementHitCount(ep.getId());
                    break;
                }
            }

            if (!excluded) {
                SubscriptionEntry subscriptionEntry = new SubscriptionEntry();
                subscriptionEntry.setFeedEntry(feedEntry);
                subscriptionEntry.setSubscription(subscription);
                subscriptionEntry.setCreatedAt(timeService.getCurrentTime());

                subscriptionEntryRepository.save(subscriptionEntry);
                subscriptionRepository.updateLastFeedEntryIdAndIncrementUnseenAndIncrementFetchCount(feedEntry.getId(), subscription.getId());
            } else {
                subscriptionRepository.updateLastFeedEntryId(feedEntry.getId(), subscription.getId());
            }

        }
    }
}
