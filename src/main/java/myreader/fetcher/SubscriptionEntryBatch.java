package myreader.fetcher;

import myreader.entity.ExclusionPattern;
import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedEntryRepository;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.service.time.TimeService;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Kamill Sokol
 */
@Transactional
public class SubscriptionEntryBatch {

    private final FeedEntryRepository feedEntryRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final TimeService timeService;
    private ExclusionChecker exclusionChecker = new ExclusionChecker();

    public SubscriptionEntryBatch(FeedEntryRepository feedEntryRepository, SubscriptionRepository subscriptionRepository, SubscriptionEntryRepository subscriptionEntryRepository, TimeService timeService) {
        this.feedEntryRepository = feedEntryRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.timeService = timeService;
    }

    public List<SubscriptionEntry> updateUserSubscriptionEntries(Feed feed, List<FetcherEntry> fetchedEntries) {
        List<FetcherEntry> newEntries = new ArrayList<>();
        List<SubscriptionEntry> toIndex = new ArrayList<>();

        for (FetcherEntry dto : fetchedEntries) {
            int result = feedEntryRepository.countByTitleOrGuidOrUrl(dto.getTitle(), dto.getGuid(), dto.getUrl());

            if (result == 0) {
                newEntries.add(dto);
            }
        }

        if (newEntries.isEmpty()) {
            return toIndex;
        }

        for (FetcherEntry dto : newEntries) {
            FeedEntry feedEntry = new FeedEntry();
            feedEntry.setContent(dto.getContent());
            feedEntry.setFeed(feed);
            feedEntry.setGuid(dto.getGuid());
            feedEntry.setTitle(dto.getTitle());
            feedEntry.setUrl(dto.getUrl());
            feedEntry.setCreatedAt(timeService.getCurrentTime());

            feedEntryRepository.save(feedEntry);
            List<Subscription> subscriptionList = subscriptionRepository.findByUrl(feed.getUrl());

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
                    toIndex.add(subscriptionEntry);
                }

                subscriptionRepository.save(subscription);
            }
        }

        return toIndex;
    }
}
