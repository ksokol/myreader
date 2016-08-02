package myreader.fetcher;

import myreader.entity.ExclusionPattern;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
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
    private final TimeService timeService;
    private ExclusionChecker exclusionChecker = new ExclusionChecker();

    @Autowired
    public SubscriptionEntryBatch(SubscriptionRepository subscriptionRepository, SubscriptionEntryRepository subscriptionEntryRepository, TimeService timeService) {
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.timeService = timeService;
    }

    public void updateUserSubscriptionEntries(FeedEntry feedEntry) {
        List<Subscription> subscriptionList = subscriptionRepository.findByUrl(feedEntry.getFeed().getUrl());

        for (Subscription subscription : subscriptionList) {
            boolean excluded = false;

            for (ExclusionPattern ep : subscription.getExclusions()) {
                excluded = exclusionChecker.isExcluded(ep.getPattern(), feedEntry.getTitle(), feedEntry.getContent());

                if (excluded) {
                    ep.setHitCount(ep.getHitCount() + 1);
                    break;
                }
            }

            if (!excluded) {
                SubscriptionEntry subscriptionEntry = new SubscriptionEntry();
                subscriptionEntry.setFeedEntry(feedEntry);
                subscriptionEntry.setSubscription(subscription);
                subscriptionEntry.setCreatedAt(timeService.getCurrentTime());

                subscription.setSum(subscription.getSum() + 1);
                subscription.setUnseen(subscription.getUnseen() +1);

                subscriptionEntryRepository.save(subscriptionEntry);
            }

            subscriptionRepository.save(subscription);
        }
    }
}
