package myreader.fetcher.jobs;

import myreader.fetcher.FeedQueue;
import myreader.fetcher.SubscriptionBatch;
import myreader.fetcher.persistence.FetchResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.ContextClosedEvent;

import static org.assertj.core.api.Fail.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SyndFetcherJobTests {

  private SyndFetcherJob job;
  private FeedQueue queueMock;
  private SubscriptionBatch serviceMock;

  @BeforeEach
  void setUp() {
    queueMock = mock(FeedQueue.class);
    serviceMock = mock(SubscriptionBatch.class);
    job = new SyndFetcherJob(queueMock, serviceMock);
  }

  @Test
  void shouldNotThrowAnException() {
    when(queueMock.take()).thenReturn(new FetchResult("url1"), new FetchResult("url2"), null);
    doThrow(new RuntimeException()).when(serviceMock).update(any(FetchResult.class));

    try {
      job.run();
    } catch (Exception exception) {
      fail("shouldn't catch an exception here");
    }

    verify(queueMock, times(3)).take();
    verify(serviceMock, times(2)).update(any(FetchResult.class));
  }

  @Test
  void shouldNeverCallService() {
    when(queueMock.take()).thenReturn(new FetchResult("url1"), new FetchResult("url2"), null);

    job.onApplicationEvent(new ContextClosedEvent(mock(ApplicationContext.class)));
    job.run();

    verify(queueMock, times(1)).take();
    verify(serviceMock, never()).update(any(FetchResult.class));
  }
}
