package myreader.config;

import myreader.fetcher.FeedParser;
import myreader.fetcher.FeedQueue;
import myreader.fetcher.SubscriptionBatch;
import myreader.fetcher.jobs.FeedListFetcherJob;
import myreader.fetcher.jobs.FetchErrorCleanerJob;
import myreader.fetcher.jobs.SyndFetcherJob;
import myreader.repository.FeedRepository;
import myreader.repository.FetchErrorRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

import java.util.concurrent.Executor;

import static org.hamcrest.Matchers.instanceOf;
import static org.mockito.Matchers.argThat;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * @author Kamill Sokol
 */
public class TaskConfigTests {

    private TaskConfig uut;

    private Executor executor;

    @Before
    public void before() {
        executor = mock(Executor.class);

        uut = new TaskConfig();

        uut.setExecutor(executor);
        uut.setFeedParser(mock(FeedParser.class));
        uut.setFeedRepository(mock(FeedRepository.class));
        uut.setSubscriptionBatch(mock(SubscriptionBatch.class));
        uut.setFeedQueue(mock(FeedQueue.class));
        uut.setFetchErrorRepository(mock(FetchErrorRepository.class));
        uut.setFetchErrorRetainInDay(1);
    }

    @Test
    public void testConfigureTasks() throws Exception {
        final Environment environment = mock(Environment.class);

        uut.setEnvironment(environment);

        when(environment.getProperty("task.enabled", Boolean.class, true)).thenReturn(true);

        final ScheduledTaskRegistrar scheduledTaskRegistrar = mock(ScheduledTaskRegistrar.class);

        uut.configureTasks(scheduledTaskRegistrar);

        verify(executor, times(2)).execute(argThat(instanceOf(SyndFetcherJob.class)));
        verify(scheduledTaskRegistrar, times(1)).addFixedRateTask(argThat(instanceOf(FeedListFetcherJob.class)), eq(300000L));
        verify(scheduledTaskRegistrar).addCronTask(argThat(instanceOf(FetchErrorCleanerJob.class)), eq("0 30 2 * * *"));
    }
}
