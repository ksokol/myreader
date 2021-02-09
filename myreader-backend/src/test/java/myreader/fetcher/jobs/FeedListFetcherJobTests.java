package myreader.fetcher.jobs;

import myreader.entity.Subscription;
import myreader.fetcher.FeedParseException;
import myreader.fetcher.FeedParser;
import myreader.fetcher.FeedQueue;
import myreader.fetcher.persistence.FetchResult;
import myreader.repository.SubscriptionRepository;
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

public class FeedListFetcherJobTests {

  private static final String LAST_MODIFIED = "lastModified";
  private static final String URL = "url";

  private FeedListFetcherJob job;
  private FeedQueue queueMock;
  private SubscriptionRepository subscriptionRepositoryMock;
  private FeedParser feedParser;

  @Before
  public void setUp() {
    queueMock = mock(FeedQueue.class);
    subscriptionRepositoryMock = mock(SubscriptionRepository.class);
    feedParser = mock(FeedParser.class);
    job = new FeedListFetcherJob(queueMock, subscriptionRepositoryMock, feedParser);
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
    when(subscriptionRepositoryMock.findAll()).thenReturn(singletonList(new Subscription(null, null)));

    job.onApplicationEvent(new ContextClosedEvent(mock(ApplicationContext.class)));
    job.run();

    verify(feedParser, never()).parse(anyString(), anyString());
  }

  @Test
  public void whenReturnsNoResultThenNeverAddToQueue() {
    var feed = new Subscription(URL, null);
    feed.setLastModified(LAST_MODIFIED);
    var fetchResult = new FetchResult(URL);

    when(queueMock.getSize()).thenReturn(0);
    when(subscriptionRepositoryMock.findAll()).thenReturn(singletonList(feed));
    when(feedParser.parse(URL, LAST_MODIFIED)).thenReturn(Optional.of(fetchResult));

    job.run();

    verify(feedParser, times(1)).parse(URL, LAST_MODIFIED);
  }

  @Test
  public void whenReturnsResultThenAddToQueue() {
    Subscription feed = new Subscription(URL, null);
    feed.setLastModified(LAST_MODIFIED);
    var fetchResult = new FetchResult(null);

    when(queueMock.getSize()).thenReturn(0);
    when(subscriptionRepositoryMock.findAll()).thenReturn(singletonList(feed));
    when(feedParser.parse(URL, LAST_MODIFIED)).thenReturn(Optional.of(fetchResult));

    job.run();

    verify(feedParser, times(1)).parse(URL, LAST_MODIFIED);
    verify(queueMock, times(1)).add(fetchResult);
  }

  @Test
  public void whenReturnsExceptionThenAddOneToQueue() {
    var feedMock1 = mock(Subscription.class);
    var feedMock2 = mock(Subscription.class);
    FetchResult fetchResult = new FetchResult(null);

    when(queueMock.getSize()).thenReturn(0);
    when(subscriptionRepositoryMock.findAll()).thenReturn(asList(feedMock1, feedMock2));
    when(feedParser.parse(isNull(), isNull())).thenThrow(new FeedParseException()).thenReturn(Optional.of(fetchResult));

    job.run();

    verify(feedParser, times(2)).parse(any(), any());
    verify(queueMock, times(1)).add(fetchResult);
  }
}
