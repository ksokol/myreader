package myreader.fetcher.jobs;

import myreader.fetcher.FeedQueue;
import myreader.service.subscription.SubscriptionBatchService;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.fail;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.*;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public class SyndFetcherJobTest {

    private SyndFetcherJob uut = new SyndFetcherJob();
    private FeedQueue queueMock;
    private SubscriptionBatchService serviceMock;

    @Before
    public void setUp() throws Exception {
        queueMock = mock(FeedQueue.class);
        serviceMock = mock(SubscriptionBatchService.class);

        uut.setFeedQueue(queueMock);
        uut.setSubscriptionBatchService(serviceMock);
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
}
