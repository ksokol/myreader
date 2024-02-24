package myreader.fetcher.jobs;

import myreader.entity.Subscription;
import myreader.fetcher.FeedParseException;
import myreader.fetcher.FeedParser;
import myreader.fetcher.FeedQueue;
import myreader.fetcher.persistence.FetchResult;
import myreader.repository.SubscriptionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.ContextClosedEvent;

import java.time.OffsetDateTime;
import java.util.Optional;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static myreader.test.OffsetDateTimes.ofEpochMilli;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

class FeedListFetcherJobTests {

  private static final String LAST_MODIFIED = "lastModified";
  private static final String URL = "url";

  private FeedListFetcherJob job;
  private FeedQueue queueMock;
  private SubscriptionRepository subscriptionRepositoryMock;
  private FeedParser feedParser;

  @BeforeEach
  public void setUp() {
    queueMock = mock(FeedQueue.class);
    subscriptionRepositoryMock = mock(SubscriptionRepository.class);
    feedParser = mock(FeedParser.class);
    job = new FeedListFetcherJob(queueMock, subscriptionRepositoryMock, feedParser);
  }

  @Test
  void givenQueueNotEmptyThenAbort() {
    given(queueMock.getSize()).willReturn(1);

    job.run();

    verify(feedParser, never()).parse(anyString(), anyString());
  }

  @Test
  void givenApplicationContextClosedEventShouldAbort() {
    given(queueMock.getSize()).willReturn(0);
    given(subscriptionRepositoryMock.findAll()).willReturn(singletonList(new Subscription(
      "url",
      null,
      null,
      null,
      0,
      null,
      0,
      null,
      false,
      null,
      null,
      ofEpochMilli(1000)
    )));

    job.onApplicationEvent(new ContextClosedEvent(mock(ApplicationContext.class)));
    job.run();

    verify(feedParser, never())
      .parse(anyString(), anyString());
  }

  @Test
  void givenReturnsNoResultShouldNotAddToQueue() {
    var feed = new Subscription(
      URL,
      null,
      null,
      null,
      0,
      LAST_MODIFIED,
      0,
      null,
      false,
      null,
      null,
      ofEpochMilli(1000)
    );
    var fetchResult = new FetchResult(URL);

    given(queueMock.getSize()).willReturn(0);
    given(subscriptionRepositoryMock.findAll()).willReturn(singletonList(feed));
    given(feedParser.parse(URL, LAST_MODIFIED)).willReturn(Optional.of(fetchResult));

    job.run();

    verify(feedParser, times(1)).parse(URL, LAST_MODIFIED);
  }

  @Test
  void givenReturnsResultShouldnAddToQueue() {
    var feed = new Subscription(
      URL,
      null,
      null,
      null,
      0,
      LAST_MODIFIED,
      0,
      null,
      false,
      null,
      null,
      ofEpochMilli(1000)
    );
    var fetchResult = new FetchResult(null);

    given(queueMock.getSize()).willReturn(0);
    given(subscriptionRepositoryMock.findAll()).willReturn(singletonList(feed));
    given(feedParser.parse(URL, LAST_MODIFIED)).willReturn(Optional.of(fetchResult));

    job.run();

    verify(feedParser, times(1)).parse(URL, LAST_MODIFIED);
    verify(queueMock, times(1)).add(fetchResult);
  }

  @Test
  void givenThrowsExceptionShouldNotAddToQueue() {
    var feedMock1 = mock(Subscription.class);
    var feedMock2 = mock(Subscription.class);
    FetchResult fetchResult = new FetchResult(null);

    given(queueMock.getSize()).willReturn(0);
    given(subscriptionRepositoryMock.findAll())
      .willReturn(asList(feedMock1, feedMock2));
    given(feedParser.parse(isNull(), isNull()))
      .willThrow(new FeedParseException())
      .willReturn(Optional.of(fetchResult));

    job.run();

    verify(feedParser, times(2)).parse(any(), any());
    verify(queueMock, times(1)).add(fetchResult);
  }

  @Test
  void givenThrowsExceptionShouldPersistError() {
    var subscription = new Subscription(
      "irrelevant",
      null,
      null,
      null,
      0,
      null,
      0,
      0,
      false,
      null,
      null,
      OffsetDateTime.now()
    );
    subscription.setId(1L);
    var idCaptor = ArgumentCaptor.forClass(Long.class);
    var messageCaptor = ArgumentCaptor.forClass(String.class);
    var datetimeCaptor = ArgumentCaptor.forClass(OffsetDateTime.class);

    given(queueMock.getSize()).willReturn(0);
    given(subscriptionRepositoryMock.findAll()).willReturn(singletonList(subscription));
    given(feedParser.parse(subscription.getUrl(), subscription.getLastModified()))
      .willThrow(new FeedParseException("expected exception", null));

    var now = OffsetDateTime.now();
    job.run();

    verify(queueMock, never()).add(any());
    verify(subscriptionRepositoryMock, times(1)).saveLastErrorMessage(idCaptor.capture(), messageCaptor.capture(), datetimeCaptor.capture());

    assertThat(idCaptor.getValue()).isEqualTo(1L);
    assertThat(messageCaptor.getValue()).isEqualTo("expected exception");
    assertThat(datetimeCaptor.getValue()).isStrictlyBetween(now.minusSeconds(2), now.plusSeconds(2));
  }
}
