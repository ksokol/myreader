package myreader.fetcher;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedEntryRepository;
import myreader.repository.FeedRepository;
import myreader.service.time.TimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionBatch {

    private final FeedRepository feedRepository;
    private final FeedEntryRepository feedEntryRepository;
    private final TimeService timeService;

    @Autowired
    public SubscriptionBatch(FeedRepository feedRepository, FeedEntryRepository feedEntryRepository, TimeService timeService) {
        this.feedRepository = feedRepository;
        this.feedEntryRepository = feedEntryRepository;
        this.timeService = timeService;
    }

    @Transactional
    public void updateUserSubscriptions(FetchResult fetchResult) {
        final Feed feed = feedRepository.findByUrl(fetchResult.getUrl());

        if (feed == null) {
            return;
        }

        int newCount = 0;

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

                newCount++;
            }
        }

        feed.setLastModified(fetchResult.getLastModified());
        feed.setFetched(feed.getFetched() + newCount);

        feedRepository.save(feed);
    }
}
