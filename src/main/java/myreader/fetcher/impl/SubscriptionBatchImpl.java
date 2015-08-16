package myreader.fetcher.impl;

import myreader.entity.Feed;
import myreader.entity.SubscriptionEntry;
import myreader.fetcher.SubscriptionBatch;
import myreader.fetcher.SubscriptionEntryBatch;
import myreader.fetcher.persistence.FetchResult;
import myreader.repository.FeedRepository;
import myreader.repository.SubscriptionEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionBatchImpl implements SubscriptionBatch {

    private final FeedRepository feedRepository;
    private final SubscriptionEntryBatch subscriptionBatchService;
    private final SubscriptionEntryRepository subscriptionEntryRepository;

    @Autowired
    public SubscriptionBatchImpl(FeedRepository feedRepository, SubscriptionEntryBatch subscriptionBatchService, SubscriptionEntryRepository subscriptionEntryRepository) {
        this.feedRepository = feedRepository;
        this.subscriptionBatchService = subscriptionBatchService;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
    }

    @Override
    public long updateUserSubscriptions(FetchResult fetchResult) {
        List<SubscriptionEntry> newEntries = Collections.emptyList();
        final Feed feed = feedRepository.findByUrl(fetchResult.getUrl());

        if (feed != null) {
            newEntries = subscriptionBatchService.updateUserSubscriptionEntries(feed, fetchResult.getEntries());

            feed.setLastModified(fetchResult.getLastModified());
            feed.setFetched(feed.getFetched() + newEntries.size());

            feedRepository.save(feed);
            subscriptionEntryRepository.save(newEntries);
        }

        return newEntries.size();
    }
}
