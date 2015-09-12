package myreader.fetcher.jobs;

import static org.junit.Assert.fail;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import myreader.fetcher.FeedQueue;
import myreader.fetcher.SubscriptionBatch;
import myreader.fetcher.persistence.FetchResult;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.ContextClosedEvent;

/**
 * @author Kamill Sokol
 */
public class SyndFetcherJobTest {

    private SyndFetcherJob uut;
    private FeedQueue queueMock;
    private SubscriptionBatch serviceMock;

    @Before
    public void setUp() throws Exception {
        queueMock = mock(FeedQueue.class);
        serviceMock = mock(SubscriptionBatch.class);
        uut = new SyndFetcherJob("junit", queueMock, serviceMock);
    }

    @Test
    public void shouldNotThrowAnException() throws Exception {
        when(queueMock.poll()).thenReturn(new FetchResult("url1"), new FetchResult("url2"), null);
        doThrow(new RuntimeException()).when(serviceMock).updateUserSubscriptions(any(FetchResult.class));

        try {
            uut.run();
        } catch(Exception e) {
            fail("shouldn't catch an exception here");
        }

        verify(queueMock, times(3)).poll();
        verify(serviceMock, times(2)).updateUserSubscriptions(any(FetchResult.class));
    }

    @Test
    public void shouldNeverCallService() throws Exception {
        when(queueMock.poll()).thenReturn(new FetchResult("url1"), new FetchResult("url2"), null);

        uut.onApplicationEvent(new ContextClosedEvent(mock(ApplicationContext.class)));
        uut.run();

        verify(queueMock, times(1)).poll();
        verify(serviceMock, never()).updateUserSubscriptions(any(FetchResult.class));
    }
}
