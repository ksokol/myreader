package myreader.fetcher;

import myreader.entity.ExclusionPattern;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
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

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@DataJpaTest(
  showSql = false,
  includeFilters = @Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {SubscriptionEntryBatch.class, SubscriptionEntryBatchTests.TestConfig.class})
)
@WithTestProperties
class SubscriptionEntryBatchTests {

  private Subscription subscription1;
  private Subscription subscription2;

  @Autowired
  private SubscriptionEntryBatch subscriptionEntryBatch;

  @Autowired
  private TestEntityManager em;

  @BeforeEach
  void setUp() {
    subscription1 = new Subscription("http://url1", "title1");
    subscription1 = em.persist(subscription1);

    subscription2 = new Subscription("http://url2", "title1");
    subscription2 = em.persist(subscription2);
  }

  @Test
  void shouldUpdateSubscriptionStatus() {
    var feedEntry = createFeedEntry(subscription1);

    subscriptionEntryBatch.updateUserSubscriptionEntries();
    em.clear();

    assertThat(em.find(Subscription.class, subscription1.getId()))
      .hasFieldOrPropertyWithValue("unseen", 1)
      .hasFieldOrPropertyWithValue("fetchCount", 1)
      .hasFieldOrPropertyWithValue("lastFeedEntryId", feedEntry.getId());
  }

  @Test
  void shouldUpdateSubscriptionEntries() {
    createFeedEntry(subscription1);

    subscriptionEntryBatch.updateUserSubscriptionEntries();
    em.clear();

    assertThat(em.find(Subscription.class, subscription1.getId()).getSubscriptionEntries())
      .hasSize(1);

    assertThat(em.find(Subscription.class, subscription2.getId()).getSubscriptionEntries())
      .isEmpty();
  }

  @Test
  void shouldNotUpdateSubscriptionExclusions() {
    createFeedEntry(subscription1);
    var exclusionPattern = em.persist(new ExclusionPattern("some pattern", subscription1));

    subscriptionEntryBatch.updateUserSubscriptionEntries();
    em.clear();

    assertThat(em.find(ExclusionPattern.class, exclusionPattern.getId()))
      .hasFieldOrPropertyWithValue("hitCount", 0);
  }

  @Test
  void shouldNotUpdateSubscriptionStatus() {
    subscriptionEntryBatch.updateUserSubscriptionEntries();
    em.clear();

    assertThat(em.find(Subscription.class, subscription1.getId()))
      .hasFieldOrPropertyWithValue("unseen", 0)
      .hasFieldOrPropertyWithValue("fetchCount", 0)
      .hasFieldOrPropertyWithValue("lastFeedEntryId", null);
  }

  @Test
  void shouldNotUpdateSubscriptionEntries() {
    subscriptionEntryBatch.updateUserSubscriptionEntries();
    em.clear();

    assertThat(em.find(Subscription.class, subscription1.getId()).getSubscriptionEntries())
      .isEmpty();

    assertThat(em.find(Subscription.class, subscription2.getId()).getSubscriptionEntries())
      .isEmpty();
  }

  @Test
  void shouldUpdateSubscriptionExclusions() {
    createFeedEntry(subscription1);
    var exclusionPattern = em.persist(new ExclusionPattern(".*title.*", subscription1));

    subscriptionEntryBatch.updateUserSubscriptionEntries();
    em.clear();

    assertThat(em.find(ExclusionPattern.class, exclusionPattern.getId()))
      .hasFieldOrPropertyWithValue("hitCount", 1);
  }

  @TestConfiguration
  static class TestConfig {

    @Bean
    Clock clock() {
      return Clock.fixed(Instant.EPOCH, ZoneId.of("UTC"));
    }
  }

  private FeedEntry createFeedEntry(Subscription subscription) {
    var feedEntry = new FeedEntry(subscription);
    feedEntry.setTitle("entry title");
    feedEntry.setUrl("url");
    feedEntry.setContent("content");
    feedEntry.setGuid("guid");
    return em.persist(feedEntry);
  }
}
