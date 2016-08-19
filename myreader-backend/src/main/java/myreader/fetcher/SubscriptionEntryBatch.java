package myreader.fetcher;

import myreader.entity.ExclusionPattern;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.repository.ExclusionRepository;
import myreader.repository.FeedEntryRepository;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.service.time.TimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionEntryBatch {

    private final FeedEntryRepository feedEntryRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final ExclusionRepository exclusionRepository;
    private final TimeService timeService;
    private ExclusionChecker exclusionChecker = new ExclusionChecker();

    @Autowired
    public SubscriptionEntryBatch(FeedEntryRepository feedEntryRepository, SubscriptionRepository subscriptionRepository, SubscriptionEntryRepository subscriptionEntryRepository, ExclusionRepository exclusionRepository, TimeService timeService) {
        this.feedEntryRepository = feedEntryRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.exclusionRepository = exclusionRepository;
        this.timeService = timeService;
    }

    public void updateUserSubscriptionEntries() {
        List<Subscription> subscriptions = subscriptionRepository.findAll();

        for (Subscription subscription : subscriptions) {
            Slice<FeedEntry> slice;

            if(subscription.getLastFeedEntryId() == null) {
                slice = feedEntryRepository.findByFeedId(subscription.getFeed().getId(), new PageRequest(0, 10));
            } else {
                slice = feedEntryRepository.findByGreaterThanFeedEntryId(subscription.getLastFeedEntryId(), subscription.getFeed().getId(), new PageRequest(0, 10));
            }

            do {
                for (FeedEntry entry : slice.getContent()) {
                    process(subscription, entry);
                }

                if(slice.hasNext()) {
                    slice = feedEntryRepository.findByGreaterThanFeedEntryId(subscription.getLastFeedEntryId(), subscription.getFeed().getId(), slice.nextPageable());
                }
            } while(slice.hasNext());
        }
    }

    @Transactional
    public void process(Subscription subscription, FeedEntry feedEntry) {
        if(subscriptionEntryRepository.contains(feedEntry.getId(), subscription.getId())) {
            subscriptionRepository.updateLastFeedEntryId(feedEntry.getId(), subscription.getId());
            return;
        }

        List<ExclusionPattern> exclusions = exclusionRepository.findBySubscriptionId(subscription.getId());

        for (ExclusionPattern exclusionPattern : exclusions) {
            final boolean excluded = exclusionChecker.isExcluded(exclusionPattern.getPattern(), feedEntry.getTitle(), feedEntry.getContent());

            if(excluded) {
                exclusionRepository.incrementHitCount(exclusionPattern.getId());
                subscriptionRepository.updateLastFeedEntryId(feedEntry.getId(), subscription.getId());
                return;
            }
        }

        SubscriptionEntry subscriptionEntry = new SubscriptionEntry();
        subscriptionEntry.setFeedEntry(feedEntry);
        subscriptionEntry.setSubscription(subscription);
        subscriptionEntry.setCreatedAt(timeService.getCurrentTime());

        subscriptionEntryRepository.save(subscriptionEntry);

        subscriptionRepository.updateLastFeedEntryIdAndIncrementUnseenAndIncrementFetchCount(feedEntry.getId(), subscription.getId());

    }
}
