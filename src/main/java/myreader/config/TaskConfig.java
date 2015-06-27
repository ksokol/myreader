package myreader.config;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import myreader.fetcher.FeedParser;
import myreader.fetcher.FeedQueue;
import myreader.fetcher.SubscriptionBatch;
import myreader.fetcher.SubscriptionEntryBatch;
import myreader.fetcher.impl.HttpCallDecisionMaker;
import myreader.fetcher.jobs.FeedListFetcherJob;
import myreader.fetcher.jobs.SyndFetcherJob;
import myreader.repository.FeedEntryRepository;
import myreader.repository.FeedRepository;
import myreader.repository.FetchStatisticRepository;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.service.time.TimeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

/**
 * @author Kamill Sokol
 */
@Configuration
@ComponentScan("myreader.fetcher")
@EnableScheduling
public class TaskConfig implements SchedulingConfigurer {

    @Autowired
    private HttpCallDecisionMaker httpCallDecisionMaker;
    @Autowired
    private FeedQueue feedQueue;
    @Autowired
    private FeedRepository feedRepository;
    @Autowired
    private FeedParser feedParser;
    @Autowired
    private FetchStatisticRepository fetchStatisticRepository;
    @Autowired
    private FeedEntryRepository feedEntryRepository;
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;
    @Autowired
    private TimeService timeService;
    @Autowired
    private Environment environment;
    @Qualifier(value = "customExecutor")
    @Autowired
    private Executor executor;

    @Bean
    public SubscriptionEntryBatch subscriptionEntryBatch() {
        return new SubscriptionEntryBatch(feedEntryRepository, subscriptionRepository, subscriptionEntryRepository, timeService);
    }

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

    private SubscriptionBatch subscriptionBatch() {
        return new SubscriptionBatch(feedParser, feedRepository, fetchStatisticRepository, subscriptionEntryBatch(), subscriptionEntryRepository);
    }

    private FeedListFetcherJob feedListFetcher() {
        return new FeedListFetcherJob(httpCallDecisionMaker, feedQueue, feedRepository);
    }

    private SyndFetcherJob syndFetcherJob(String jobName) {
        return newSyndFetcherJob(jobName);
    }

    private SyndFetcherJob newSyndFetcherJob(String jobName) {
        return new SyndFetcherJob(jobName, feedQueue, subscriptionBatch());
    }

}
