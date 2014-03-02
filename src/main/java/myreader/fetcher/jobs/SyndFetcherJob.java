package myreader.fetcher.jobs;

import myreader.fetcher.FeedQueue;

import myreader.service.subscription.SubscriptionBatchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanNameAware;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StopWatch;

class SyndFetcherJob implements Runnable, DisposableBean, BeanNameAware {

    private static final Logger logger = LoggerFactory.getLogger(SyndFetcherJob.class);
    private String jobName;

    @Autowired
    private FeedQueue feedQueue;

    @Autowired
    private SubscriptionBatchService subscriptionBatchService;

    private volatile boolean alive = true;

    @Override
    public void run() {
        logger.debug("start");

        String origThreadName = Thread.currentThread().getName();
        Thread.currentThread().setName(this.jobName);
        StopWatch timer = new StopWatch();

        try {
            timer.start();
            String feedUrl = null;

            while ((feedUrl = feedQueue.poll()) != null && alive) {
                subscriptionBatchService.updateUserSubscriptions(feedUrl);
            }
        } finally {
            timer.stop();
            logger.debug("stop");
            logger.info("total time {} sec", timer.getTotalTimeSeconds());
            Thread.currentThread().setName(origThreadName);
        }
    }

    @Override
    public void destroy() throws Exception {
        logger.info("stop");
        this.alive = false;
    }

    @Override
    public void setBeanName(String name) {
        this.jobName = name;
    }
}
