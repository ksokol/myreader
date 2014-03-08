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

    private static final Logger log = LoggerFactory.getLogger(SyndFetcherJob.class);
    private String jobName;
    private String swap;

    @Autowired
    private FeedQueue feedQueue;

    @Autowired
    private SubscriptionBatchService subscriptionBatchService;

    private volatile boolean alive = true;

    @Override
    public void run() {
        log.debug("start");

        toggleCurrentThreadName();
        StopWatch timer = new StopWatch();

        try {
            timer.start();
            String feedUrl = null;

            while ((feedUrl = feedQueue.poll()) != null && alive) {
                try {
                    subscriptionBatchService.updateUserSubscriptions(feedUrl);
                } catch(Exception e) {
                    log.error("error during subscription update for {}", feedUrl, e);
                }
            }
        } finally {
            timer.stop();
            log.debug("stop");
            log.info("total time {} sec", timer.getTotalTimeSeconds());
            toggleCurrentThreadName();
        }
    }

    @Override
    public void destroy() throws Exception {
        log.info("stop");
        this.alive = false;
    }

    @Override
    public void setBeanName(String name) {
        this.jobName = name;
    }

    private void toggleCurrentThreadName() {
        if(jobName == null ) {
            return;
        }
        Thread thread = Thread.currentThread();

        if(swap == null) {
            swap = Thread.currentThread().getName();
            thread.setName(jobName);
        } else {
            thread.setName(swap);
            swap = null;
        }
    }

    public FeedQueue getFeedQueue() {
        return feedQueue;
    }

    public void setFeedQueue(FeedQueue feedQueue) {
        this.feedQueue = feedQueue;
    }

    public SubscriptionBatchService getSubscriptionBatchService() {
        return subscriptionBatchService;
    }

    public void setSubscriptionBatchService(SubscriptionBatchService subscriptionBatchService) {
        this.subscriptionBatchService = subscriptionBatchService;
    }
}
