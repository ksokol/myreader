package myreader.fetcher;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jdbc.core.JdbcAggregateOperations;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static myreader.test.OffsetDateTimes.ofEpochMilli;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@Transactional
@SpringBootTest
@WithTestProperties
class SubscriptionBatchTests {

  private static final String ENTRY_TITLE = "title1";
  private static final String ENTRY_GUID = "guid1";
  private static final String ENTRY_URL = "http://entry1";

  private Subscription subscription1;
  private Subscription subscription2;
  private SubscriptionEntry entry1;
  private SubscriptionEntry entry12;

  @Autowired
  private JdbcAggregateOperations template;

  @Autowired
  private SubscriptionBatch subscriptionBatch;

  @BeforeEach
  void setUp() {
    subscription1 = template.save(new Subscription(
      "http://url1",
      "title1",
      null,
      null,
      1,
      null,
      1,
      null,
      ofEpochMilli(1000)
    ));

    entry1 = template.save(new SubscriptionEntry(
      ENTRY_TITLE,
      ENTRY_GUID,
      ENTRY_URL,
      null,
      false,
      false,
      null,
      subscription1.getId(),
      ofEpochMilli(1000)
    ));

    subscription2 = template.save(new Subscription(
      "http://url2",
      "title1",
      null,
      null,
      1,
      null,
      1,
      null,
      ofEpochMilli(1000)
    ));

    entry12 = template.save(new SubscriptionEntry(
      ENTRY_TITLE + "12",
      ENTRY_GUID + "12",
      ENTRY_URL + "12",
      null,
      false,
      false,
      null,
      subscription2.getId(),
      ofEpochMilli(1000)
    ));
  }

  @Test
  void shouldNotSaveFeedEntryWhenFeedIsUnknown() {
    subscriptionBatch.update(new FetchResult("http://unknown"));

    assertThat(template.findAll(SubscriptionEntry.class))
      .extracting("id")
      .contains(entry1.getId(), entry12.getId());
  }

  @Test
  void shouldNotSaveFeedEntryWhenResultIsEmpty() {
    subscriptionBatch.update(
      new FetchResult(List.of(), "last modified", "title", "http://unknown", 0)
    );

    assertThat(template.findAll(SubscriptionEntry.class))
      .extracting("id")
      .contains(entry1.getId(), entry12.getId());
  }

  @Test
  void shouldNotSaveFeedEntryWhenOnlyTitleChanged() {
    subscriptionBatch.update(
      new FetchResult(List.of(newTitle()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(template.findAll(SubscriptionEntry.class))
      .extracting("id")
      .contains(entry1.getId(), entry12.getId());
  }

  @Test
  void shouldNotSaveFeedEntryWhenOnlyGuidChanged() {
    subscriptionBatch.update(
      new FetchResult(List.of(newGuid()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(template.findAll(SubscriptionEntry.class))
      .extracting("id")
      .contains(entry1.getId(), entry12.getId());
  }

  @Test
  void shouldNotSaveFeedEntryWhenOnlyUrlChanged() {
    subscriptionBatch.update(
      new FetchResult(List.of(newUrl()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(template.findAll(SubscriptionEntry.class))
      .extracting("id")
      .contains(entry1.getId(), entry12.getId());
  }

  @Test
  void shouldSaveFeedEntry() {
    subscriptionBatch.update(
      new FetchResult(List.of(newEntry()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(template.findAll(SubscriptionEntry.class))
      .extracting("id")
      .contains(entry1.getId(), entry12.getId(), entry12.getId() + 1);
  }

  @Test
  void shouldNotIncrementFetchedCountWhenNoNewFeedEntryArrived() {
    subscriptionBatch.update(
      new FetchResult(List.of(existing()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(template.findById(subscription1.getId(), Subscription.class))
      .hasFieldOrPropertyWithValue("lastModified", "last modified")
      .hasFieldOrPropertyWithValue("overallFetchCount", 1);

    assertThat(template.findById(subscription2.getId(), Subscription.class))
      .hasFieldOrPropertyWithValue("lastModified", null)
      .hasFieldOrPropertyWithValue("overallFetchCount", 1);
  }

  @Test
  void shouldNotIncrementFetchedCountWhenOnlyTitleChanged() {
    subscriptionBatch.update(
      new FetchResult(List.of(newTitle()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(template.findById(subscription1.getId(), Subscription.class))
      .hasFieldOrPropertyWithValue("lastModified", "last modified")
      .hasFieldOrPropertyWithValue("overallFetchCount", 1);

    assertThat(template.findById(subscription2.getId(), Subscription.class))
      .hasFieldOrPropertyWithValue("lastModified", null)
      .hasFieldOrPropertyWithValue("overallFetchCount", 1);
  }

  @Test
  void shouldNotIncrementFetchedCountWhenOnlyGuidChanged() {
    subscriptionBatch.update(
      new FetchResult(List.of(newGuid()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(template.findById(subscription1.getId(), Subscription.class))
      .hasFieldOrPropertyWithValue("lastModified", "last modified")
      .hasFieldOrPropertyWithValue("overallFetchCount", 1);

    assertThat(template.findById(subscription2.getId(), Subscription.class))
      .hasFieldOrPropertyWithValue("lastModified", null)
      .hasFieldOrPropertyWithValue("overallFetchCount", 1);
  }

  @Test
  void shouldNotIncrementFetchedCountWhenOnlyUrlChanged() {
    subscriptionBatch.update(
      new FetchResult(List.of(newUrl()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(template.findById(subscription1.getId(), Subscription.class))
      .hasFieldOrPropertyWithValue("lastModified", "last modified")
      .hasFieldOrPropertyWithValue("overallFetchCount", 1);

    assertThat(template.findById(subscription2.getId(), Subscription.class))
      .hasFieldOrPropertyWithValue("lastModified", null)
      .hasFieldOrPropertyWithValue("overallFetchCount", 1);
  }

  @Test
  void shouldIncrementFetchedCountWhenNewEntryArrived() {
    subscriptionBatch.update(
      new FetchResult(List.of(newEntry()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(template.findById(subscription1.getId(), Subscription.class))
      .hasFieldOrPropertyWithValue("lastModified", "last modified")
      .hasFieldOrPropertyWithValue("overallFetchCount", 2);

    assertThat(template.findById(subscription2.getId(), Subscription.class))
      .hasFieldOrPropertyWithValue("lastModified", null)
      .hasFieldOrPropertyWithValue("overallFetchCount", 1);
  }

  @Test
  void shouldUpdateResultSizePerFetchWhenCountIsGreaterThanZero() {
    subscriptionBatch.update(
      new FetchResult(List.of(), null, null, subscription1.getUrl(), 10)
    );

    assertThat(template.findById(subscription1.getId(), Subscription.class))
      .hasFieldOrPropertyWithValue("resultSizePerFetch", 10);
  }

  @Test
  void shouldNotUpdateResultSizePerFetchWhenCountIsZero() {
    subscriptionBatch.update(
      new FetchResult(List.of(), null, null, subscription1.getUrl(), 0)
    );

    assertThat(template.findById(subscription1.getId(), Subscription.class))
      .hasFieldOrPropertyWithValue("resultSizePerFetch", 1000);
  }

  private FetcherEntry newTitle() {
    return fetcherEntry("new title", ENTRY_GUID, ENTRY_URL);
  }

  private FetcherEntry newGuid() {
    return fetcherEntry(ENTRY_TITLE, "new guid", ENTRY_URL);
  }

  private FetcherEntry newUrl() {
    return fetcherEntry(ENTRY_TITLE, ENTRY_GUID, "new url");
  }

  private FetcherEntry existing() {
    return fetcherEntry(ENTRY_TITLE, ENTRY_GUID, ENTRY_URL);
  }

  private FetcherEntry newEntry() {
    return fetcherEntry("new title", "new guid", "new url");
  }

  private FetcherEntry fetcherEntry(String title, String guid, String url) {
    var fetcherEntry = new FetcherEntry();
    fetcherEntry.setTitle(title);
    fetcherEntry.setGuid(guid);
    fetcherEntry.setUrl(url);
    fetcherEntry.setFeedUrl(subscription1.getUrl());
    return fetcherEntry;
  }
}
