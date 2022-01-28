package myreader.fetcher;

import myreader.fetcher.persistence.FetchResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class FeedQueueTests {

  private FeedQueue queue;

  @BeforeEach
  void setUp() {
    queue = new FeedQueue();
  }

  @Test
  void add() {
    queue.add(new FetchResult("url"));

    assertThat(queue.getSize())
      .isEqualTo(1);
  }

  @Test
  void addDuplicate() {
    queue.add(new FetchResult("url"));
    queue.add(new FetchResult("url"));

    assertThat(queue.getSize())
      .isEqualTo(1);
  }

  @Test
  void take() {
    queue.add(new FetchResult("url"));

    assertThat(queue.take())
      .isEqualTo(new FetchResult("url"));
    assertThat(queue.take())
      .isNull();
  }
}
