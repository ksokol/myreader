package myreader.fetcher.jobs;

import java.util.Iterator;
import java.util.List;

import myreader.entity.Feed;
import myreader.fetcher.FeedQueue;
import myreader.fetcher.impl.HttpCallDecisionMaker;

import myreader.repository.FeedRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component("feedListFetcher")
class FeedListFetcher implements Runnable, DisposableBean {
    private Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    HttpCallDecisionMaker httpCallDecisionMaker;

    @Autowired
    FeedQueue feedQueue;

    @Autowired
    private FeedRepository feedRepository;

    private volatile boolean alive = true;

    @Transactional
    @Override
    public void run() {
        logger.debug("start");

        if (feedQueue.getSize() > 0) {
            logger.info("queue has {} feeds. exiting", feedQueue.getSize());
            return;
        }

        Iterable<Feed> feeds = feedRepository.findAll();
        Iterator<Feed> iterator = feeds.iterator();
        logger.info("checking {} feeds", feedRepository.count());

       // for (int i = 0; i < feeds.size() && alive; i++) {
        while(iterator.hasNext() && alive) {
            Feed f = iterator.next();
            boolean result = httpCallDecisionMaker.decide(f.getUrl(), f.getLastModified());
            logger.debug("calling: {}, lastModified: {}, url: {}",
                    new Object[] { result, f.getLastModified(), f.getUrl() });

            if (result) {
                feedQueue.add(f.getUrl());
            }
        }

        logger.info("{} new elements in queue", feedQueue.getSize());
    }

    @Override
    public void destroy() throws Exception {
        logger.info("stop");
        this.alive = false;
    }
}
