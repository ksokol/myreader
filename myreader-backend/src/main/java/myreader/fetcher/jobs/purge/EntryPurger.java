package myreader.fetcher.jobs.purge;

import myreader.repository.FeedEntryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * @author Kamill Sokol
 */
@Component
public class EntryPurger {

    private static final Logger log = LoggerFactory.getLogger(EntryPurger.class);

    private final FeedEntryRepository feedEntryRepository;
    private final PageRequest pageRequest;

    public EntryPurger(FeedEntryRepository feedEntryRepository, @Value("${myreader.entry-purger.page-size:1000}") int pageSize) {
        this.feedEntryRepository = feedEntryRepository;
        pageRequest = new PageRequest(0, pageSize);
    }

    public void purge(Long feedId, Date retainAfterDate) {
        log.info("retaining feed entries after {} for feed {}", retainAfterDate, feedId);
        Page<Long> feedEntries = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                feedId,
                retainAfterDate,
                pageRequest);

        while(feedEntries.getContent().size() > 0) {
            log.info("{} elements left for deletion for feed {}", feedEntries.getTotalElements(), feedId);

            for (Long feedEntry : feedEntries) {
                feedEntryRepository.delete(feedEntry);
            }

            feedEntries = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                    feedId,
                    retainAfterDate,
                    pageRequest);
        }
    }
}
