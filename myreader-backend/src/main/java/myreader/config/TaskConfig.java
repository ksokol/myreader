package myreader.config;

import myreader.fetcher.FeedParser;
import myreader.fetcher.FeedQueue;
import myreader.fetcher.SubscriptionBatch;
import myreader.fetcher.SubscriptionEntryBatch;
import myreader.fetcher.jobs.EntryPurgeJob;
import myreader.fetcher.jobs.FeedListFetcherJob;
import myreader.fetcher.jobs.FeedPurgeJob;
import myreader.fetcher.jobs.FetchErrorCleanerJob;
import myreader.fetcher.jobs.SubscriptionJob;
import myreader.fetcher.jobs.SyndFetcherJob;
import myreader.fetcher.jobs.purge.EntryPurger;
import myreader.fetcher.jobs.purge.RetainDateDeterminer;
import myreader.repository.FeedRepository;
import myreader.repository.FetchErrorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

import java.time.Clock;
import java.util.concurrent.Executor;

/**
 * @author Kamill Sokol
 */
@Configuration
@EnableScheduling
public class TaskConfig implements SchedulingConfigurer {

    private FeedRepository feedRepository;
    private SubscriptionBatch subscriptionBatch;
    private SubscriptionEntryBatch subscriptionEntryBatch;
    private FetchErrorRepository fetchErrorRepository;
    private Environment environment;
    private Executor executor;
    private FeedParser feedParser;
    private FeedQueue feedQueue;
    private EntryPurger entryPurger;
    private RetainDateDeterminer retainDateDeterminer;
    private int fetchErrorRetainInDay;

    @Override
    public void configureTasks(final ScheduledTaskRegistrar taskRegistrar) {
        taskRegistrar.setScheduler(executor);

        final boolean taskEnabled = environment.getProperty("task.enabled", Boolean.class, true);

        if(taskEnabled) {
            executor.execute(syndFetcherJob("syndFetcher-1"));
            executor.execute(syndFetcherJob("syndFetcher-2"));
            taskRegistrar.addFixedRateTask(feedListFetcher(), 300000);
            taskRegistrar.addFixedRateTask(subscriptionJob(), 300000);
            taskRegistrar.addCronTask(newFetchErrorCleanerJob(), "0 30 2 * * *");
            taskRegistrar.addCronTask(newFeedPurgeJob(), "0 34 1 * * *");
            taskRegistrar.addCronTask(newEntryPurgeJob(), "0 33 3 * * *");
        }
    }

    private SubscriptionJob subscriptionJob() {
        return new SubscriptionJob("subscriptionJob", subscriptionEntryBatch);
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

    private FetchErrorCleanerJob newFetchErrorCleanerJob() {
        return new FetchErrorCleanerJob(Clock.systemDefaultZone(), fetchErrorRetainInDay, fetchErrorRepository);
    }

    private FeedPurgeJob newFeedPurgeJob() {
        return new FeedPurgeJob(feedRepository);
    }

    private EntryPurgeJob newEntryPurgeJob() {
        return new EntryPurgeJob(feedRepository, entryPurger, retainDateDeterminer);
    }

    @Autowired
    public void setFeedRepository(final FeedRepository feedRepository) {
        this.feedRepository = feedRepository;
    }

    @Autowired
    public void setFetchErrorRepository(FetchErrorRepository fetchErrorRepository) {
        this.fetchErrorRepository = fetchErrorRepository;
    }

    @Value("${job.fetchError.retainInDays}")
    public void setFetchErrorRetainInDay(int fetchErrorRetainInDay) {
        this.fetchErrorRetainInDay = fetchErrorRetainInDay;
    }

    @Autowired
    public void setSubscriptionBatch(final SubscriptionBatch subscriptionBatch) {
        this.subscriptionBatch = subscriptionBatch;
    }

    @Autowired
    public void setSubscriptionEntryBatch(SubscriptionEntryBatch subscriptionEntryBatch) {
        this.subscriptionEntryBatch = subscriptionEntryBatch;
    }

    @Autowired
    public void setEnvironment(final Environment environment) {
        this.environment = environment;
    }

    @Qualifier(value = "customExecutor")
    @Autowired
    public void setExecutor(final Executor executor) {
        this.executor = executor;
    }

    @Autowired
    public void setFeedParser(final FeedParser feedParser) {
        this.feedParser = feedParser;
    }

    @Autowired
    public void setFeedQueue(final FeedQueue feedQueue) {
        this.feedQueue = feedQueue;
    }

    @Autowired
    public void setEntryPurger(EntryPurger entryPurger) {
        this.entryPurger = entryPurger;
    }

    @Autowired
    public void setRetainDateDeterminer(RetainDateDeterminer retainDateDeterminer) {
        this.retainDateDeterminer = retainDateDeterminer;
    }
}
