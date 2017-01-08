package myreader.fetcher.jobs.purge;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.repository.FeedEntryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Optional;

/**
 * @author Kamill Sokol
 */
@Component
public class RetainDateDeterminer {

    private static final Logger log = LoggerFactory.getLogger(RetainDateDeterminer.class);

    private final FeedEntryRepository feedEntryRepository;
    private final int minFeedThreshold;

    public RetainDateDeterminer(FeedEntryRepository feedEntryRepository, @Value("${myreader.min-feed-threshold:50}") int minFeedThreshold) {
        this.feedEntryRepository = feedEntryRepository;
        this.minFeedThreshold = minFeedThreshold;
    }

    public Optional<Date> determine(Feed feed) {
        long entryCount = feedEntryRepository.countByFeedId(feed.getId());
        Integer feedThreshold = Math.max(feed.getResultSizePerFetch(), minFeedThreshold);

        if(feedThreshold >= entryCount) {
            log.info("skipping. threshold of {} entries not reached for feed '{} ({})' (actual {})", feedThreshold, feed.getTitle(), feed.getId(), entryCount);
            return Optional.empty();
        }

        Page<FeedEntry> page = feedEntryRepository.findByFeedIdOrderByCreatedAtDesc(feed.getId(), new PageRequest(0, feedThreshold));

        if(page.getTotalElements() == 0) {
            return Optional.empty();
        }

        FeedEntry lastFeedEntry = page.getContent().get(page.getContent().size() - 1);
        return Optional.of(lastFeedEntry.getCreatedAt());
    }
}
