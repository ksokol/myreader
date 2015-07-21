package myreader.fetcher.jobs;

import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import myreader.entity.Feed;
import myreader.fetcher.FeedParseException;
import myreader.fetcher.FeedParser;
import myreader.fetcher.FeedQueue;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.ContextClosedEvent;

import java.util.Arrays;
import java.util.Collections;

/**
 * @author Kamill Sokol
 */
public class FeedListFetcherJobTests {

    private static final String LAST_MODIFIED = "lastModified";
    private static final String URL = "url";

    private FeedListFetcherJob uut;
    private FeedQueue queueMock;
    private FeedRepository feedRepositoryMock;
    private FeedParser feedParser;

    @Before
    public void setUp() throws Exception {
        queueMock = mock(FeedQueue.class);
        feedRepositoryMock = mock(FeedRepository.class);
        feedParser = mock(FeedParser.class);
        uut = new FeedListFetcherJob(queueMock, feedRepositoryMock, feedParser);
    }

    @Test
    public void whenQueueNotEmptyThenAbort() throws Exception {
        when(queueMock.getSize()).thenReturn(1);

        uut.run();

        verify(feedParser, never()).parse(anyString(), anyString());
    }

    @Test
    public void whenApplicationContextClosedEventThenAbort() throws Exception {
        when(queueMock.getSize()).thenReturn(0);
        when(feedRepositoryMock.findAll()).thenReturn(Collections.singletonList(new Feed()));

        uut.onApplicationEvent(new ContextClosedEvent(mock(ApplicationContext.class)));
        uut.run();

        verify(feedParser, never()).parse(anyString(), anyString());
    }

    @Test
    public void whenReturnsNoResultThenNeverAddToQueue() throws Exception {
        final Feed feed = new Feed();
        feed.setUrl(URL);
        feed.setLastModified(LAST_MODIFIED);

        final FetchResult fetchResult = new FetchResult(URL);

        when(queueMock.getSize()).thenReturn(0);
        when(feedRepositoryMock.findAll()).thenReturn(Collections.singletonList(feed));
        when(feedParser.parse(URL, LAST_MODIFIED)).thenReturn(fetchResult);

        uut.run();

        verify(feedParser, times(1)).parse(URL, LAST_MODIFIED);
    }

    @Test
    public void whenReturnsResultThenAddToQueue() throws Exception {
        final Feed feed = new Feed();
        feed.setUrl(URL);
        feed.setLastModified(LAST_MODIFIED);

        final FetchResult fetchResult = new FetchResult(Arrays.asList(new FetcherEntry()), null, null);
        fetchResult.setUrl(URL);

        when(queueMock.getSize()).thenReturn(0);
        when(feedRepositoryMock.findAll()).thenReturn(Collections.singletonList(feed));
        when(feedParser.parse(URL, LAST_MODIFIED)).thenReturn(fetchResult);

        uut.run();

        verify(feedParser, times(1)).parse(URL, LAST_MODIFIED);
        verify(queueMock, times(1)).add(fetchResult);
    }

    @Test
    public void whenReturnsExceptionThenAddOneToQueue() throws Exception {
        Feed feedMock1 = mock(Feed.class);
        Feed feedMock2 = mock(Feed.class);

        final FetchResult fetchResult = new FetchResult(Arrays.asList(new FetcherEntry()), null, null);
        fetchResult.setUrl(URL);

        when(queueMock.getSize()).thenReturn(0);
        when(feedRepositoryMock.findAll()).thenReturn(Arrays.asList(feedMock1, feedMock2));
        when(feedParser.parse(anyString(), anyString())).thenThrow(new FeedParseException()).thenReturn(fetchResult);

        uut.run();

        verify(feedParser, times(2)).parse(anyString(), anyString());
        verify(queueMock, times(1)).add(fetchResult);
    }
}
