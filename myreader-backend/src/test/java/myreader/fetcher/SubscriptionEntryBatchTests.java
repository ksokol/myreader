package myreader.fetcher;

import myreader.entity.ExclusionPattern;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.persistence.TypedQuery;
import javax.transaction.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@AutoConfigureTestEntityManager
@Transactional
@SpringBootTest
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
    subscription1 = em.persist(new Subscription("http://url1", "title1"));
    subscription2 = em.persist(new Subscription("http://url2", "title1"));
  }

  @Test
  void shouldUpdateSubscriptionStatus() {
    subscriptionEntryBatch.update(subscription1, fetcherEntry());
    em.clear();

    assertThat(em.find(Subscription.class, subscription1.getId()))
      .hasFieldOrPropertyWithValue("unseen", 1)
      .hasFieldOrPropertyWithValue("acceptedFetchCount", 1);
  }

  @Test
  void shouldUpdateSubscriptionEntries() {
    subscriptionEntryBatch.update(subscription1, fetcherEntry());
    em.clear();

    assertThat(findEntry(subscription1))
      .hasFieldOrPropertyWithValue("excluded", false);

    assertThat(findEntry(subscription2))
      .isNull();
  }

  @Test
  void shouldNotUpdateSubscriptionExclusions() {
    var exclusionPattern = em.persist(new ExclusionPattern("some pattern", subscription1));

    subscriptionEntryBatch.update(subscription1, fetcherEntry());
    em.clear();

    assertThat(em.find(ExclusionPattern.class, exclusionPattern.getId()))
      .hasFieldOrPropertyWithValue("hitCount", 0);
  }

  @Test
  void shouldUpdateSubscriptionExclusionsWhenExcludedPatternInTitleFound() {
    var fetcherEntry = fetcherEntry();
    fetcherEntry.setTitle("fetcher title entry");
    var exclusionPattern = em.persist(new ExclusionPattern(".*title.*", subscription1));

    subscriptionEntryBatch.update(subscription1, fetcherEntry);
    em.clear();

    assertThat(em.find(ExclusionPattern.class, exclusionPattern.getId()))
      .hasFieldOrPropertyWithValue("hitCount", 1);
  }

  @Test
  void shouldUpdateSubscriptionExclusionsWhenExcludedPatternInUrlFound() {
    var fetcherEntry = fetcherEntry();
    fetcherEntry.setUrl("fetcher url entry");
    var exclusionPattern = em.persist(new ExclusionPattern(".*url.*", subscription1));

    subscriptionEntryBatch.update(subscription1, fetcherEntry);
    em.clear();

    assertThat(em.find(ExclusionPattern.class, exclusionPattern.getId()))
      .hasFieldOrPropertyWithValue("hitCount", 1);
  }

  @Test
  void shouldUpdateSubscriptionExclusionsWhenExcludedPatternInContentFound() {
    var fetcherEntry = fetcherEntry();
    fetcherEntry.setContent("fetcher content entry");
    var exclusionPattern = em.persist(new ExclusionPattern(".*content.*", subscription1));

    subscriptionEntryBatch.update(subscription1, fetcherEntry);
    em.clear();

    assertThat(em.find(ExclusionPattern.class, exclusionPattern.getId()))
      .hasFieldOrPropertyWithValue("hitCount", 1);
  }

  @Test
  void shouldUpdateSubscriptionWhenExcludedPatternInTitleFound() {
    var fetcherEntry = fetcherEntry();
    fetcherEntry.setTitle("fetcher title entry");
    em.persist(new ExclusionPattern(".*title.*", subscription1));

    subscriptionEntryBatch.update(subscription1, fetcherEntry);
    em.clear();

    assertThat(em.find(Subscription.class, subscription1.getId()))
      .hasFieldOrPropertyWithValue("unseen", 0)
      .hasFieldOrPropertyWithValue("acceptedFetchCount", 0);
    assertThat(findEntry(subscription1))
      .hasFieldOrPropertyWithValue("excluded", true);
  }

  @Test
  void shouldUpdateSubscriptionWhenExcludedPatternInContentFound() {
    var fetcherEntry = fetcherEntry();
    fetcherEntry.setTitle("fetcher content entry");
    em.persist(new ExclusionPattern(".*content.*", subscription1));

    subscriptionEntryBatch.update(subscription1, fetcherEntry);
    em.clear();

    assertThat(em.find(Subscription.class, subscription1.getId()))
      .hasFieldOrPropertyWithValue("unseen", 0)
      .hasFieldOrPropertyWithValue("acceptedFetchCount", 0);
    assertThat(findEntry(subscription1))
      .hasFieldOrPropertyWithValue("excluded", true);
  }

  @Test
  void shouldUpdateSubscriptionWhenExcludedPatternInUrlFound() {
    var fetcherEntry = fetcherEntry();
    fetcherEntry.setUrl("fetcher url entry");
    em.persist(new ExclusionPattern(".*url.*", subscription1));

    subscriptionEntryBatch.update(subscription1, fetcherEntry);
    em.clear();

    assertThat(em.find(Subscription.class, subscription1.getId()))
      .hasFieldOrPropertyWithValue("unseen", 0)
      .hasFieldOrPropertyWithValue("acceptedFetchCount", 0);
    assertThat(findEntry(subscription1))
      .hasFieldOrPropertyWithValue("excluded", true);
  }

  private SubscriptionEntry findEntry(Subscription subscription) {
    TypedQuery<SubscriptionEntry> query = em.getEntityManager().createQuery(
      "select e from SubscriptionEntry e where e.subscription.id = ?1", SubscriptionEntry.class
    );
    query.setParameter(1, subscription.getId());

    var resultList = query.getResultList();
    return resultList.size() == 1 ? resultList.get(0) : null;
  }

  private FetcherEntry fetcherEntry() {
    var fetcherEntry = new FetcherEntry();
    fetcherEntry.setUrl("http://entryUrl");
    fetcherEntry.setFeedUrl("http://feedUrl");
    return fetcherEntry;
  }
}
