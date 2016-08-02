package myreader.fetcher.impl;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.fetcher.SubscriptionBatch;
import myreader.fetcher.SubscriptionEntryBatch;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedEntryRepository;
import myreader.repository.FeedRepository;
import myreader.service.time.TimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionBatchImpl implements SubscriptionBatch {

    private final FeedRepository feedRepository;
    private final FeedEntryRepository feedEntryRepository;
    private final SubscriptionEntryBatch subscriptionBatchService;
    private final TimeService timeService;

    @Autowired
    public SubscriptionBatchImpl(FeedRepository feedRepository, FeedEntryRepository feedEntryRepository, SubscriptionEntryBatch subscriptionBatchService, TimeService timeService) {
        this.feedRepository = feedRepository;
        this.feedEntryRepository = feedEntryRepository;
        this.subscriptionBatchService = subscriptionBatchService;
        this.timeService = timeService;
    }

    @Override
    public long updateUserSubscriptions(FetchResult fetchResult) {
        List<FeedEntry> newEntries = new ArrayList<>();
        final Feed feed = feedRepository.findByUrl(fetchResult.getUrl());

        if (feed != null) {
            for (FetcherEntry dto : fetchResult.getEntries()) {
                int result = feedEntryRepository.countByTitleOrGuidOrUrl(dto.getTitle(), dto.getGuid(), dto.getUrl());

                if (result == 0) {
                    FeedEntry feedEntry = new FeedEntry();
                    feedEntry.setContent(dto.getContent());
                    feedEntry.setFeed(feed);
                    feedEntry.setGuid(dto.getGuid());
                    feedEntry.setTitle(dto.getTitle());
                    feedEntry.setUrl(dto.getUrl());
                    feedEntry.setCreatedAt(timeService.getCurrentTime());

                    feedEntryRepository.save(feedEntry);

                    newEntries.add(feedEntry);
                }
            }

            subscriptionBatchService.updateUserSubscriptionEntries(newEntries);

            feed.setLastModified(fetchResult.getLastModified());
            feed.setFetched(feed.getFetched() + newEntries.size());

            feedRepository.save(feed);
        }

        return newEntries.size();
    }
}
