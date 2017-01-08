package myreader.fetcher.jobs;

import myreader.entity.Feed;
import myreader.fetcher.jobs.purge.EntryPurger;
import myreader.fetcher.jobs.purge.RetainDateDeterminer;
import myreader.repository.FeedRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * @author Kamill Sokol
 */
public class EntryPurgeJob extends BaseJob {

    private static final Logger log = LoggerFactory.getLogger(EntryPurgeJob.class);

    private final FeedRepository feedRepository;
    private final EntryPurger entryPurger;
    private final RetainDateDeterminer determiner;

    public EntryPurgeJob(FeedRepository feedRepository, EntryPurger entryPurger, RetainDateDeterminer determiner) {
        super("entryPurgeJob");
        this.feedRepository = feedRepository;
        this.entryPurger = entryPurger;
        this.determiner = determiner;
    }

    @Override
    public void work() {
        List<Feed> feeds = feedRepository.findAll();

        for (Feed feed : feeds) {
            log.info("start cleaning old entries from feed '{}'", feed.getTitle());
            determiner.determine(feed).ifPresent(retainDate -> entryPurger.purge(feed.getId(), retainDate));
            log.info("finished cleaning old entries from feed '{}'", feed.getTitle());
        }
    }
}
