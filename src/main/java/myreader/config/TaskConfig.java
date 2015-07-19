package myreader.config;

import myreader.fetcher.FeedParser;
import myreader.fetcher.FeedQueue;
import myreader.fetcher.SubscriptionBatch;
import myreader.fetcher.jobs.FeedListFetcherJob;
import myreader.fetcher.jobs.SyndFetcherJob;
import myreader.repository.FeedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

import java.util.concurrent.Executor;

/**
 * @author Kamill Sokol
 */
@Configuration
@ComponentScan("myreader.fetcher")
@EnableScheduling
public class TaskConfig implements SchedulingConfigurer {

    @Autowired
    private FeedQueue feedQueue;
    @Autowired
    private FeedRepository feedRepository;
    @Autowired
    private SubscriptionBatch subscriptionBatch;
    @Autowired
    private Environment environment;
    @Qualifier(value = "customExecutor")
    @Autowired
    private Executor executor;
    @Autowired
    private FeedParser feedParser;

    @Override
    public void configureTasks(final ScheduledTaskRegistrar taskRegistrar) {
        taskRegistrar.setScheduler(executor);

        final boolean taskEnabled = environment.getProperty("task.enabled", Boolean.class, true);

        if(taskEnabled) {
            taskRegistrar.addFixedRateTask(syndFetcherJob("syndFetcher-1"), 300000);
            taskRegistrar.addFixedRateTask(syndFetcherJob("syndFetcher-2"), 300000);
            taskRegistrar.addFixedRateTask(feedListFetcher(), 300000);

            /*
                <!-- TODO deactivated until this job has an unittest -->
                <!-- <task:scheduled ref="purgerJob" method="run" cron="0 0 3 * * *"/> -->
             */
        }
    }

    private FeedListFetcherJob feedListFetcher() {
        return new FeedListFetcherJob(feedQueue, feedRepository, feedParser);
    }

    private SyndFetcherJob syndFetcherJob(String jobName) {
        return newSyndFetcherJob(jobName);
    }

    private SyndFetcherJob newSyndFetcherJob(String jobName) {
        return new SyndFetcherJob(jobName, feedQueue, subscriptionBatch);
    }

}
