package myreader.fetcher.jobs;

import myreader.fetcher.FeedQueue;
import myreader.fetcher.SubscriptionBatch;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.util.Assert;
import org.springframework.util.StopWatch;

public class SyndFetcherJob implements Runnable, ApplicationListener<ContextClosedEvent> {
    private static final Logger log = LoggerFactory.getLogger(SyndFetcherJob.class);

    private String jobName;
    private String swap;
    private final FeedQueue feedQueue;
    private final SubscriptionBatch subscriptionBatchService;
    private volatile boolean alive = true;

    public SyndFetcherJob(String jobName, FeedQueue feedQueue, SubscriptionBatch subscriptionBatchService) {
        Assert.notNull(jobName);
        Assert.notNull(feedQueue);
        Assert.notNull(subscriptionBatchService);
        this.jobName = jobName;
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

    private void toggleCurrentThreadName() {
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
