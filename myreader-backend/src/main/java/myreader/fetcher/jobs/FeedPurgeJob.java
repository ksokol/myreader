package myreader.fetcher.jobs;

import myreader.entity.Feed;
import myreader.repository.FeedRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * @author Kamill Sokol
 */
public class FeedPurgeJob extends BaseJob {

    private static final Logger log = LoggerFactory.getLogger(FeedPurgeJob.class);

    private final FeedRepository feedRepository;

    public FeedPurgeJob(FeedRepository feedRepository) {
        super("feedPurgeJob");
        this.feedRepository = feedRepository;
    }

    @Override
    public void work() {
        List<Feed> zeroSubscriptionFeeds = feedRepository.findByZeroSubscriptions();
        log.info("feeds without subscription: {}", zeroSubscriptionFeeds.size());

        zeroSubscriptionFeeds.forEach(feed -> {
            log.info("deleting feed '{}'", feed.getTitle());
            feedRepository.delete(feed);
        });
    }
}
