package myreader.service.subscriptionentry.impl;

import myreader.entity.*;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedEntryRepository;
import myreader.service.feed.FeedService;
import myreader.service.subscription.SubscriptionService;
import myreader.service.subscriptionentry.SubscriptionEntryBatchService;
import myreader.service.subscriptionentry.SubscriptionEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
    private final SubscriptionService subscriptionService;
    private final FeedService feedService;
    private final SubscriptionEntryService subscriptionEntryService;
    private ExclusionChecker exclusionChecker = new ExclusionChecker();

    @Autowired
    public SubscriptionEntryBatchServiceImpl(FeedEntryRepository feedEntryRepository, SubscriptionService subscriptionService, FeedService feedService, SubscriptionEntryService subscriptionEntryService) {
        this.feedEntryRepository = feedEntryRepository;
        this.subscriptionService = subscriptionService;
        this.feedService = feedService;
        this.subscriptionEntryService = subscriptionEntryService;
    }

    @Override
    public int updateUserSubscriptionEntries(Feed feed, List<FetcherEntry> fetchedEntries) {
        List<FetcherEntry> newEntries = new ArrayList<FetcherEntry>();
        int count = 0;

        for (FetcherEntry dto : fetchedEntries) {
            int result = feedEntryRepository.countByTitleOrGuidOrUrl(dto.getTitle(), dto.getGuid(), dto.getUrl());

            if (result == 0) {
                newEntries.add(dto);
            }
        }

        if (newEntries.isEmpty()) {
            return count;
        }

        for (FetcherEntry dto : newEntries) {
            FeedEntry feedEntry = new FeedEntry();

            feedEntry.setContent(dto.getContent());
            feedEntry.setFeed(feed);
            feedEntry.setGuid(dto.getGuid());
            feedEntry.setTitle(dto.getTitle());
            feedEntry.setUrl(dto.getUrl());

            feedEntryRepository.save(feedEntry);

            count++;

            List<Subscription> subscriptionList = feedService.findAllSubscriptionsByUrl(feed.getUrl());

            for (Subscription subscription : subscriptionList) {
                boolean excluded = false;
                List<SubscriptionEntry> toSave = new ArrayList<SubscriptionEntry>();

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

                    subscriptionEntryService.save(subscriptionEntry);
                }


                subscriptionService.save(subscription);
            }
        }

        return count;
    }

    public ExclusionChecker getExclusionChecker() {
        return exclusionChecker;
    }

    public void setExclusionChecker(ExclusionChecker exclusionChecker) {
        this.exclusionChecker = exclusionChecker;
    }
}
