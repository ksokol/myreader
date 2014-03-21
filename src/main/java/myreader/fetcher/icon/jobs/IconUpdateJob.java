package myreader.fetcher.icon.jobs;

import myreader.entity.Feed;
import myreader.fetcher.icon.impl.IconUpdater;
import myreader.repository.FeedRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;

import java.util.Iterator;
import java.util.List;

public class IconUpdateJob implements Runnable, ApplicationListener<ContextClosedEvent> {
    private static final Logger log = LoggerFactory.getLogger(IconUpdateJob.class);

    private final IconUpdater iconUpdater;
    private final FeedRepository feedRepository;
    private volatile boolean alive = true;

    public IconUpdateJob(IconUpdater iconUpdater, FeedRepository feedRepository) {
        this.iconUpdater = iconUpdater;
        this.feedRepository = feedRepository;
    }

    @Override
    public void run() {
        log.debug("start");

        List<Feed> feeds = feedRepository.findAll();
        Iterator<Feed> iterator = feeds.iterator();
        int count = 0;
        int size = feeds.size();
        log.info("checking {} for new icons", size);

        for(int i=0;i<size && alive;i++) {
            Feed f = iterator.next();
            log.info("checking icon for {}", f.getUrl());
            iconUpdater.updateIcon(f.getUrl());
        }

        if(alive) {
            log.info("icon check done");
        } else {
            log.info("{} feeds left for icon check but got stop signal", size - count);
        }

        log.debug("end");
    }

    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        log.info("got stop signal");
        alive = false;
    }
}
