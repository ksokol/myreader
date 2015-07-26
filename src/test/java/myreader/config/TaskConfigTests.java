package myreader.config;

import static org.mockito.Matchers.argThat;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import myreader.fetcher.FeedParser;
import myreader.fetcher.SubscriptionBatch;
import myreader.fetcher.jobs.FeedListFetcherJob;
import myreader.fetcher.jobs.SyndFetcherJob;
import myreader.repository.FeedRepository;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

import java.util.concurrent.Executor;

/**
 * @author Kamill Sokol
 */
public class TaskConfigTests {

    private TaskConfig uut;

    @Before
    public void before() {
        uut = new TaskConfig();

        uut.setExecutor(mock(Executor.class));
        uut.setFeedParser(mock(FeedParser.class));
        uut.setFeedRepository(mock(FeedRepository.class));
        uut.setSubscriptionBatch(mock(SubscriptionBatch.class));
    }

    @Test
    public void testConfigureTasks() throws Exception {
        final Environment environment = mock(Environment.class);

        uut.setEnvironment(environment);

        when(environment.getProperty("task.enabled", Boolean.class, true)).thenReturn(true);

        final ScheduledTaskRegistrar ScheduledTaskRegistrar = mock(ScheduledTaskRegistrar.class);

        uut.configureTasks(ScheduledTaskRegistrar);

        verify(ScheduledTaskRegistrar, times(2)).addFixedRateTask(argThat(Matchers.<Runnable>instanceOf(SyndFetcherJob.class)), eq(300000L));
        verify(ScheduledTaskRegistrar, times(1)).addFixedRateTask(argThat(Matchers.<Runnable>instanceOf(FeedListFetcherJob.class)), eq(300000L));
    }
}
