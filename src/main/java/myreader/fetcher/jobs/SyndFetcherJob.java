package myreader.fetcher.jobs;

import myreader.fetcher.FeedQueue;

import myreader.service.subscription.SubscriptionBatchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanNameAware;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.util.StopWatch;

public class SyndFetcherJob implements Runnable, BeanNameAware, ApplicationListener<ContextClosedEvent> {
    private static final Logger log = LoggerFactory.getLogger(SyndFetcherJob.class);

    private String jobName;
    private String swap;
    private final FeedQueue feedQueue;
    private final SubscriptionBatchService subscriptionBatchService;
    private volatile boolean alive = true;

    public SyndFetcherJob(FeedQueue feedQueue, SubscriptionBatchService subscriptionBatchService) {
        this.feedQueue = feedQueue;
        this.subscriptionBatchService = subscriptionBatchService;
    }

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
            log.info("total time {} sec", timer.getTotalTimeSeconds());
            toggleCurrentThreadName();
            log.debug("stop");
        }
    }

    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        log.info("got stop signal");
        alive = false;
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
}
