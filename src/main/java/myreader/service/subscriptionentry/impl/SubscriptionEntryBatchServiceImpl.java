package myreader.service.subscriptionentry.impl;

import myreader.entity.*;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedEntryRepository;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.service.feed.FeedService;
import myreader.service.subscriptionentry.SubscriptionEntryBatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@Transactional
@Service
public class SubscriptionEntryBatchServiceImpl implements SubscriptionEntryBatchService {

    private final FeedEntryRepository feedEntryRepository;
    private final FeedService feedService;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private ExclusionChecker exclusionChecker = new ExclusionChecker();

    @Autowired
    public SubscriptionEntryBatchServiceImpl(FeedEntryRepository feedEntryRepository, FeedService feedService, SubscriptionRepository subscriptionRepository, SubscriptionEntryRepository subscriptionEntryRepository) {
        this.feedEntryRepository = feedEntryRepository;
        this.feedService = feedService;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public List<SubscriptionEntry> updateUserSubscriptionEntries(Feed feed, List<FetcherEntry> fetchedEntries) {
        List<FetcherEntry> newEntries = new ArrayList<FetcherEntry>();
        List<SubscriptionEntry> toIndex = new ArrayList<SubscriptionEntry>();

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

            feedEntryRepository.save(feedEntry);
            List<Subscription> subscriptionList = feedService.findAllSubscriptionsByUrl(feed.getUrl());

            for (Subscription subscription : subscriptionList) {
                boolean excluded = false;

                for (ExclusionPattern ep : subscription.getExclusions()) {
                    excluded = exclusionChecker.isExcluded(ep.getPattern(), feedEntry.getTitle(),
                            feedEntry.getContent());

                    if (excluded) {
                        ep.setHitCount(ep.getHitCount() + 1);
                        break;
                    }
                }

                if (!excluded) {
                    SubscriptionEntry subscriptionEntry = new SubscriptionEntry();
                    subscriptionEntry.setFeedEntry(feedEntry);
                    subscriptionEntry.setSubscription(subscription);
                    subscription.setSum(subscription.getSum() + 1);

                    subscriptionEntryRepository.save(subscriptionEntry);
                    toIndex.add(subscriptionEntry);
                }

                subscriptionRepository.save(subscription);
            }
        }

        return toIndex;
    }

    public ExclusionChecker getExclusionChecker() {
        return exclusionChecker;
    }

    public void setExclusionChecker(ExclusionChecker exclusionChecker) {
        this.exclusionChecker = exclusionChecker;
    }
}
