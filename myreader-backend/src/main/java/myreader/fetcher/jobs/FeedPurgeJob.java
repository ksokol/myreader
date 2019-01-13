package myreader.fetcher.jobs;

import myreader.entity.Feed;
import myreader.repository.FeedRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author Kamill Sokol
 */
@Component
@ConditionalOnTaskEnabled
public class FeedPurgeJob extends BaseJob {

    private final FeedRepository feedRepository;

    public FeedPurgeJob(FeedRepository feedRepository) {
        super("feedPurgeJob");
        this.feedRepository = feedRepository;
    }

    @Scheduled(cron = "0 34 1 * * *")
    @Override
    public void work() {
        List<Feed> zeroSubscriptionFeeds = feedRepository.findByZeroSubscriptions();
        getLog().info("feeds without subscription: {}", zeroSubscriptionFeeds.size());

        zeroSubscriptionFeeds.forEach(feed -> {
            getLog().info("deleting feed '{} ({})'", feed.getTitle(), feed.getId());
            feedRepository.delete(feed);
            getLog().info("deleted feed '{} ({})'", feed.getTitle(), feed.getId());
        });
    }
}
