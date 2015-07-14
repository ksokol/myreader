package myreader.fetcher.jobs;

import static org.junit.Assert.fail;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import myreader.fetcher.FeedQueue;
import myreader.fetcher.SubscriptionBatch;

import myreader.test.IntegrationTestSupport;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.ContextClosedEvent;

/**
 * @author Kamill Sokol
 */
public class SyndFetcherJobTest extends IntegrationTestSupport {

    private SyndFetcherJob uut;
    private FeedQueue queueMock;
    private SubscriptionBatch serviceMock;

    @Autowired
    private ApplicationContext applicationContext;


    @Before
    public void setUp() throws Exception {
        queueMock = mock(FeedQueue.class);
        serviceMock = mock(SubscriptionBatch.class);
        uut = new SyndFetcherJob("junit", queueMock, serviceMock);
    }

    @Test
    public void shouldNotThrowAnException() throws Exception {
        when(queueMock.poll()).thenReturn("url1", "url2", null);
        doThrow(new RuntimeException()).when(serviceMock).updateUserSubscriptions(anyString());

        try {
            uut.run();
        } catch(Exception e) {
            fail("shouldn't catch an exception here");
        }

        verify(queueMock, times(3)).poll();
        verify(serviceMock, times(2)).updateUserSubscriptions(anyString());
    }

    @Test
    public void shouldNeverCallService() throws Exception {
        when(queueMock.poll()).thenReturn("url1", "url2", null);

        uut.onApplicationEvent(new ContextClosedEvent(applicationContext));
        uut.run();

        verify(queueMock, times(1)).poll();
        verify(serviceMock, never()).updateUserSubscriptions(anyString());
    }
}
