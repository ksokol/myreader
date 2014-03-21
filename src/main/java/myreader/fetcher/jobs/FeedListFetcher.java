package myreader.fetcher.jobs;

import java.util.Iterator;
import java.util.List;

import myreader.entity.Feed;
import myreader.fetcher.FeedQueue;
import myreader.fetcher.impl.HttpCallDecisionMaker;

import myreader.repository.FeedRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;

public class FeedListFetcher implements Runnable, ApplicationListener<ContextClosedEvent> {
    private static final Logger log = LoggerFactory.getLogger(FeedListFetcher.class);

    private final HttpCallDecisionMaker httpCallDecisionMaker;
    private final FeedQueue feedQueue;
    private final FeedRepository feedRepository;
    private volatile boolean alive = true;

    public FeedListFetcher(HttpCallDecisionMaker httpCallDecisionMaker, FeedQueue feedQueue, FeedRepository feedRepository) {
        this.httpCallDecisionMaker = httpCallDecisionMaker;
        this.feedQueue = feedQueue;
        this.feedRepository = feedRepository;
    }

    @Override
    public void run() {
        log.debug("start");

        if (feedQueue.getSize() > 0) {
            log.info("queue has {} feeds. aborting", feedQueue.getSize());
            return;
        }

        List<Feed> feeds = feedRepository.findAll();
        Iterator<Feed> iterator = feeds.iterator();
        int count = 0;
        int size = feeds.size();
        log.info("checking {} feeds", size);

        for(int i=0;i<size && alive;i++) {
            Feed f = iterator.next();
            boolean result = httpCallDecisionMaker.decide(f.getUrl(), f.getLastModified());
            log.debug("{}/{} call: {}, lastModified: {}, url: {}", new Object[]{i+1, size, result, f.getLastModified(), f.getUrl()});

            if (result) {
                count++;
                feedQueue.add(f.getUrl());
            }
        }

        if(alive) {
            log.info("{} new elements in queue", count);
        } else {
            log.info("{} feeds left for check but got stop signal", size - count);
        }
        log.debug("end");
    }

    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        log.info("got stop signal");
        alive = false;
    }
}
