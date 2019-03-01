package myreader.fetcher.jobs;

import myreader.entity.Feed;
import myreader.fetcher.FeedParseException;
import myreader.fetcher.FeedParser;
import myreader.fetcher.FeedQueue;
import myreader.fetcher.persistence.FetchResult;
import myreader.repository.FeedRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.ContextClosedEvent;

import java.util.Optional;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * @author Kamill Sokol
 */
public class FeedListFetcherJobTests {

    private static final String LAST_MODIFIED = "lastModified";
    private static final String URL = "url";

    private FeedListFetcherJob job;
    private FeedQueue queueMock;
    private FeedRepository feedRepositoryMock;
    private FeedParser feedParser;

    @Before
    public void setUp() {
        queueMock = mock(FeedQueue.class);
        feedRepositoryMock = mock(FeedRepository.class);
        feedParser = mock(FeedParser.class);
        job = new FeedListFetcherJob(queueMock, feedRepositoryMock, feedParser);
    }

    @Test
    public void whenQueueNotEmptyThenAbort() {
        when(queueMock.getSize()).thenReturn(1);

        job.run();

        verify(feedParser, never()).parse(anyString(), anyString());
    }

    @Test
    public void whenApplicationContextClosedEventThenAbort() {
        when(queueMock.getSize()).thenReturn(0);
        when(feedRepositoryMock.findAll()).thenReturn(singletonList(new Feed(null, null)));

        job.onApplicationEvent(new ContextClosedEvent(mock(ApplicationContext.class)));
        job.run();

        verify(feedParser, never()).parse(anyString(), anyString());
    }

    @Test
    public void whenReturnsNoResultThenNeverAddToQueue() {
        Feed feed = new Feed(URL, null);
        feed.setLastModified(LAST_MODIFIED);

        FetchResult fetchResult = new FetchResult(URL);

        when(queueMock.getSize()).thenReturn(0);
        when(feedRepositoryMock.findAll()).thenReturn(singletonList(feed));
        when(feedParser.parse(URL, LAST_MODIFIED)).thenReturn(Optional.of(fetchResult));

        job.run();

        verify(feedParser, times(1)).parse(URL, LAST_MODIFIED);
    }

    @Test
    public void whenReturnsResultThenAddToQueue() {
        Feed feed = new Feed(URL, null);
        feed.setLastModified(LAST_MODIFIED);
        FetchResult fetchResult = new FetchResult(null);

        when(queueMock.getSize()).thenReturn(0);
        when(feedRepositoryMock.findAll()).thenReturn(singletonList(feed));
        when(feedParser.parse(URL, LAST_MODIFIED)).thenReturn(Optional.of(fetchResult));

        job.run();

        verify(feedParser, times(1)).parse(URL, LAST_MODIFIED);
        verify(queueMock, times(1)).add(fetchResult);
    }

    @Test
    public void whenReturnsExceptionThenAddOneToQueue() {
        Feed feedMock1 = mock(Feed.class);
        Feed feedMock2 = mock(Feed.class);
        FetchResult fetchResult = new FetchResult(null);

        when(queueMock.getSize()).thenReturn(0);
        when(feedRepositoryMock.findAll()).thenReturn(asList(feedMock1, feedMock2));
        when(feedParser.parse(isNull(), isNull())).thenThrow(new FeedParseException()).thenReturn(Optional.of(fetchResult));

        job.run();

        verify(feedParser, times(2)).parse(any(), any());
        verify(queueMock, times(1)).add(fetchResult);
    }
}
