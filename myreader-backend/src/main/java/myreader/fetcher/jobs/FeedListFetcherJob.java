package myreader.fetcher.jobs;

import myreader.entity.Feed;
import myreader.fetcher.FeedParser;
import myreader.fetcher.FeedQueue;
import myreader.repository.FeedRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Iterator;
import java.util.List;

import static java.util.Objects.requireNonNull;

/**
 * @author Kamill Sokol
 */
@Component
@ConditionalOnTaskEnabled
public class FeedListFetcherJob extends BaseJob {

    private final FeedQueue feedQueue;
    private final FeedRepository feedRepository;
    private final FeedParser feedParser;

    public FeedListFetcherJob(FeedQueue feedQueue, FeedRepository feedRepository, FeedParser feedParser) {
        super("syndFetcherJob");
        this.feedParser = requireNonNull(feedParser, "feedParser is null");
        this.feedQueue = requireNonNull(feedQueue, "feedQueue is null");
        this.feedRepository = requireNonNull(feedRepository, "feedRepository is null");
    }

    @Scheduled(fixedRate = 300000)
    @Override
    public void work() {
        List<Feed> feeds = feedRepository.findAll();
        Iterator<Feed> iterator = feeds.iterator();
        int size = feeds.size();
        getLog().info("checking {} feeds", size);

        for(int i = 0; i < size && isAlive(); i++) {
            Feed feed = iterator.next();

            try {
                feedParser.parse(feed.getUrl(), feed.getLastModified()).ifPresent(feedQueue::add);
                getLog().debug("{}/{} lastModified: {}, url: {}", i + 1, size, feed.getLastModified(), feed.getUrl());
            } catch(Exception exception) {
                getLog().error(exception.getMessage(), exception);
            }
        }
    }
}
