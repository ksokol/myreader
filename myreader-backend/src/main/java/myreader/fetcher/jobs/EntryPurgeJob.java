package myreader.fetcher.jobs;

import myreader.entity.Feed;
import myreader.fetcher.jobs.purge.EntryPurger;
import myreader.fetcher.jobs.purge.RetainDateDeterminer;
import myreader.repository.FeedRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author Kamill Sokol
 */
@Component
@ConditionalOnTaskEnabled
public class EntryPurgeJob extends BaseJob {

    private final FeedRepository feedRepository;
    private final EntryPurger entryPurger;
    private final RetainDateDeterminer determiner;

    public EntryPurgeJob(FeedRepository feedRepository, EntryPurger entryPurger, RetainDateDeterminer determiner) {
        super("entryPurgeJob");
        this.feedRepository = feedRepository;
        this.entryPurger = entryPurger;
        this.determiner = determiner;
    }

    @Scheduled(cron = "0 33 3 * * *")
    @Override
    public void work() {
        List<Feed> feeds = feedRepository.findAll();

        for (Feed feed : feeds) {
            getLog().info("start cleaning old entries from feed '{} ({})'", feed.getTitle(), feed.getId());
            determiner.determine(feed).ifPresent(retainDate -> entryPurger.purge(feed.getId(), retainDate));
            getLog().info("finished cleaning old entries from feed '{} ({})'", feed.getTitle(), feed.getId());
        }
    }
}
