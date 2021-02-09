package myreader.fetcher;

import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.FilterType;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@DataJpaTest(
  showSql = false,
  includeFilters = @Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {SubscriptionBatch.class, SubscriptionBatchTests.TestConfig.class})
)
@WithTestProperties
class SubscriptionBatchTests {

  private static final String ENTRY_TITLE = "title1";
  private static final String ENTRY_GUID = "guid1";
  private static final String ENTRY_URL = "http://entry1";

  private Subscription subscription1;
  private Subscription subscription2;
  private FeedEntry feedEntry1;
  private FeedEntry feedEntry12;

  @Autowired
  private TestEntityManager em;

  @Autowired
  private SubscriptionBatch subscriptionBatch;

  @BeforeEach
  void setUp() {
    subscription1 = new Subscription("http://url1", "title1");
    subscription1.setFetched(1);
    subscription1 = em.persist(subscription1);

    feedEntry1 = new FeedEntry(subscription1);
    feedEntry1.setTitle(ENTRY_TITLE);
    feedEntry1.setGuid(ENTRY_GUID);
    feedEntry1.setUrl(ENTRY_URL);
    feedEntry1 = em.persist(feedEntry1);

    subscription2 = new Subscription("http://url2", "title1");
    subscription2.setFetched(1);
    subscription2 = em.persist(subscription2);

    feedEntry12 = new FeedEntry(subscription2);
    feedEntry12.setTitle(ENTRY_TITLE + "12");
    feedEntry12.setGuid(ENTRY_GUID + "12");
    feedEntry12.setUrl(ENTRY_URL + "12");
    feedEntry12 = em.persist(feedEntry12);
  }

  @Test
  void shouldNotSaveFeedEntryWhenFeedIsUnknown() {
    subscriptionBatch.updateUserSubscriptions(new FetchResult("http://unknown"));

    assertThat(em.getEntityManager().createQuery("select fe from FeedEntry fe", FeedEntry.class).getResultList())
      .extracting("id")
      .contains(feedEntry1.getId(), feedEntry12.getId());
  }

  @Test
  void shouldNotSaveFeedEntryWhenResultIsEmpty() {
    subscriptionBatch.updateUserSubscriptions(new FetchResult(List.of(), "last modified", "title", "http://unknown", 0));

    assertThat(em.getEntityManager().createQuery("select fe from FeedEntry fe", FeedEntry.class).getResultList())
      .extracting("id")
      .contains(feedEntry1.getId(), feedEntry12.getId());
  }

  @Test
  void shouldNotSaveFeedEntryWhenOnlyTitleChanged() {
    subscriptionBatch.updateUserSubscriptions(
      new FetchResult(List.of(newTitle()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(em.getEntityManager().createQuery("select fe from FeedEntry fe", FeedEntry.class).getResultList())
      .extracting("id")
      .contains(feedEntry1.getId(), feedEntry12.getId());
  }

  @Test
  void shouldNotSaveFeedEntryWhenOnlyGuidChanged() {
    subscriptionBatch.updateUserSubscriptions(
      new FetchResult(List.of(newGuid()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(em.getEntityManager().createQuery("select fe from FeedEntry fe", FeedEntry.class).getResultList())
      .extracting("id")
      .contains(feedEntry1.getId(), feedEntry12.getId());
  }

  @Test
  void shouldNotSaveFeedEntryWhenOnlyUrlChanged() {
    subscriptionBatch.updateUserSubscriptions(
      new FetchResult(List.of(newUrl()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(em.getEntityManager().createQuery("select fe from FeedEntry fe", FeedEntry.class).getResultList())
      .extracting("id")
      .contains(feedEntry1.getId(), feedEntry12.getId());
  }

  @Test
  void shouldSaveFeedEntry() {
    subscriptionBatch.updateUserSubscriptions(
      new FetchResult(List.of(newEntry()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(em.getEntityManager().createQuery("select fe from FeedEntry fe", FeedEntry.class).getResultList())
      .extracting("id")
      .contains(feedEntry1.getId(), feedEntry12.getId(), feedEntry12.getId() + 1);
  }

  @Test
  void shouldNotIncrementFetchedCountWhenNoNewFeedEntryArrived() {
    subscriptionBatch.updateUserSubscriptions(
      new FetchResult(List.of(existing()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(em.find(Subscription.class, subscription1.getId()))
      .hasFieldOrPropertyWithValue("lastModified", "last modified")
      .hasFieldOrPropertyWithValue("fetched", 1);

    assertThat(em.find(Subscription.class, subscription2.getId()))
      .hasFieldOrPropertyWithValue("lastModified", null)
      .hasFieldOrPropertyWithValue("fetched", 1);
  }

  @Test
  void shouldIncrementFetchedCountWhenOnlyTitleChanged() {
    subscriptionBatch.updateUserSubscriptions(
      new FetchResult(List.of(newTitle()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(em.find(Subscription.class, subscription1.getId()))
      .hasFieldOrPropertyWithValue("lastModified", "last modified")
      .hasFieldOrPropertyWithValue("fetched", 1);

    assertThat(em.find(Subscription.class, subscription2.getId()))
      .hasFieldOrPropertyWithValue("lastModified", null)
      .hasFieldOrPropertyWithValue("fetched", 1);
  }

  @Test
  void shouldIncrementFetchedCountWhenOnlyGuidChanged() {
    subscriptionBatch.updateUserSubscriptions(
      new FetchResult(List.of(newGuid()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(em.find(Subscription.class, subscription1.getId()))
      .hasFieldOrPropertyWithValue("lastModified", "last modified")
      .hasFieldOrPropertyWithValue("fetched", 1);

    assertThat(em.find(Subscription.class, subscription2.getId()))
      .hasFieldOrPropertyWithValue("lastModified", null)
      .hasFieldOrPropertyWithValue("fetched", 1);
  }

  @Test
  void shouldIncrementFetchedCountWhenOnlyUrlChanged() {
    subscriptionBatch.updateUserSubscriptions(
      new FetchResult(List.of(newUrl()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(em.find(Subscription.class, subscription1.getId()))
      .hasFieldOrPropertyWithValue("lastModified", "last modified")
      .hasFieldOrPropertyWithValue("fetched", 1);

    assertThat(em.find(Subscription.class, subscription2.getId()))
      .hasFieldOrPropertyWithValue("lastModified", null)
      .hasFieldOrPropertyWithValue("fetched", 1);
  }

  @Test
  void shouldIncrementFetchedCountWhenNewEntryArrived() {
    subscriptionBatch.updateUserSubscriptions(
      new FetchResult(List.of(newEntry()), "last modified", "title", subscription1.getUrl(), 0)
    );

    assertThat(em.find(Subscription.class, subscription1.getId()))
      .hasFieldOrPropertyWithValue("lastModified", "last modified")
      .hasFieldOrPropertyWithValue("fetched", 2);

    assertThat(em.find(Subscription.class, subscription2.getId()))
      .hasFieldOrPropertyWithValue("lastModified", null)
      .hasFieldOrPropertyWithValue("fetched", 1);
  }

  @Test
  void shouldUpdateResultSizePerFetchWhenCountIsGreaterThanZero() {
    subscriptionBatch.updateUserSubscriptions(new FetchResult(List.of(), null, null, subscription1.getUrl(), 10));

    assertThat(em.find(Subscription.class, subscription1.getId()))
      .hasFieldOrPropertyWithValue("resultSizePerFetch", 10);
  }

  @Test
  void shouldNotUpdateResultSizePerFetchWhenCountIsZero() {
    subscriptionBatch.updateUserSubscriptions(new FetchResult(List.of(), null, null, subscription1.getUrl(), 0));

    assertThat(em.find(Subscription.class, subscription1.getId()))
      .hasFieldOrPropertyWithValue("resultSizePerFetch", 1000);
  }

  @TestConfiguration
  static class TestConfig {

    @Bean
    Clock clock() {
      return Clock.fixed(Instant.EPOCH, ZoneId.of("UTC"));
    }
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
