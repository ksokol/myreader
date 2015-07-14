package myreader.fetcher.jobs;

import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import myreader.entity.Feed;
import myreader.fetcher.FeedQueue;
import myreader.fetcher.impl.HttpCallDecisionMaker;
import myreader.repository.FeedRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.ContextClosedEvent;

import java.util.Collections;

/**
 * @author Kamill Sokol
 */
public class FeedListFetcherJobTests {

    private static final String LAST_MODIFIED = "lastModified";
    private static final String URL = "url";

    private FeedListFetcherJob uut;
    private HttpCallDecisionMaker httpCallDecisionMakerMock;
    private FeedQueue queueMock;
    private FeedRepository feedRepositoryMock;

    @Before
    public void setUp() throws Exception {
        httpCallDecisionMakerMock = mock(HttpCallDecisionMaker.class);
        queueMock = mock(FeedQueue.class);
        feedRepositoryMock = mock(FeedRepository.class);
        uut = new FeedListFetcherJob(httpCallDecisionMakerMock, queueMock, feedRepositoryMock);
    }

    @Test
    public void whenQueueNotEmptyThenAbort() throws Exception {
        when(queueMock.getSize()).thenReturn(1);

        uut.run();

        verify(httpCallDecisionMakerMock, never()).decide(anyString());
    }

    @Test
    public void whenApplicationContextClosedEventThenAbort() throws Exception {
        when(queueMock.getSize()).thenReturn(0);
        when(feedRepositoryMock.findAll()).thenReturn(Collections.singletonList(new Feed()));

        uut.onApplicationEvent(new ContextClosedEvent(mock(ApplicationContext.class)));
        uut.run();

        verify(httpCallDecisionMakerMock, never()).decide(anyString());
    }

    @Test
    public void whenDecideReturnsFalseThenNeverAddToQueue() throws Exception {
        final Feed feed = new Feed();
        feed.setUrl(URL);
        feed.setLastModified(LAST_MODIFIED);

        when(queueMock.getSize()).thenReturn(0);
        when(feedRepositoryMock.findAll()).thenReturn(Collections.singletonList(feed));
        when(httpCallDecisionMakerMock.decide(URL, LAST_MODIFIED)).thenReturn(false);

        uut.run();

        verify(httpCallDecisionMakerMock, times(1)).decide(URL, LAST_MODIFIED);
    }

    @Test
    public void whenDecideReturnsTrueThenAddToQueue() throws Exception {
        final Feed feed = new Feed();
        feed.setUrl(URL);
        feed.setLastModified(LAST_MODIFIED);

        when(queueMock.getSize()).thenReturn(0);
        when(feedRepositoryMock.findAll()).thenReturn(Collections.singletonList(feed));
        when(httpCallDecisionMakerMock.decide(URL, LAST_MODIFIED)).thenReturn(true);

        uut.run();

        verify(httpCallDecisionMakerMock, times(1)).decide(URL, LAST_MODIFIED);
        verify(queueMock, times(1)).add(URL);
    }
}
