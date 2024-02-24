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
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.jdbc.core.JdbcAggregateOperations;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Map;

import static myreader.test.OffsetDateTimes.ofEpochMilli;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@Transactional
@SpringBootTest
@WithTestProperties
class SubscriptionEntryBatchTests {

  private Subscription subscription1;
  private Subscription subscription2;

  @Autowired
  private SubscriptionEntryBatch subscriptionEntryBatch;

  @Autowired
  private JdbcAggregateOperations template;

  @Autowired
  private NamedParameterJdbcOperations jdbcTemplate;

  @BeforeEach
  void setUp() {
    subscription1 = template.save(new Subscription(
      "http://url1",
      "title1",
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
    ));
    subscription2 = template.save(new Subscription(
      "http://url2",
      "title1",
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
    ));
  }

  @Test
  void shouldUpdateSubscription() {
    subscriptionEntryBatch.update(subscription1, fetcherEntry());

    assertThat(template.findById(subscription1.getId(), Subscription.class))
      .hasFieldOrPropertyWithValue("acceptedFetchCount", 1);
  }

  @Test
  void shouldUpdateSubscriptionEntries() {
    subscriptionEntryBatch.update(subscription1, fetcherEntry());

    assertThat(findEntry(subscription1))
      .hasFieldOrPropertyWithValue("excluded", false);

    assertThat(findEntry(subscription2))
      .isNull();
  }

  @Test
  void shouldNotUpdateSubscriptionExclusions() {
    var exclusionPattern = template.save(new ExclusionPattern("some pattern", subscription1.getId(), 0, OffsetDateTime.now()));

    subscriptionEntryBatch.update(subscription1, fetcherEntry());

    assertThat(template.findById(exclusionPattern.getId(), ExclusionPattern.class))
      .hasFieldOrPropertyWithValue("hitCount", 0);
  }

  @Test
  void shouldUpdateSubscriptionExclusionsWhenExcludedPatternInTitleFound() {
    var fetcherEntry = fetcherEntry();
    fetcherEntry.setTitle("fetcher title entry");
    var exclusionPattern = template.save(new ExclusionPattern("title", subscription1.getId(), 0, OffsetDateTime.now()));

    subscriptionEntryBatch.update(subscription1, fetcherEntry);

    assertThat(template.findById(exclusionPattern.getId(), ExclusionPattern.class))
      .hasFieldOrPropertyWithValue("hitCount", 1);
  }

  @Test
  void shouldUpdateSubscriptionExclusionsWhenExcludedPatternInUrlFound() {
    var fetcherEntry = fetcherEntry();
    fetcherEntry.setUrl("fetcher url entry");
    var exclusionPattern = template.save(new ExclusionPattern("url", subscription1.getId(), 0, OffsetDateTime.now()));

    subscriptionEntryBatch.update(subscription1, fetcherEntry);

    assertThat(template.findById(exclusionPattern.getId(), ExclusionPattern.class))
      .hasFieldOrPropertyWithValue("hitCount", 1);
  }

  @Test
  void shouldUpdateSubscriptionExclusionsWhenExcludedPatternInContentFound() {
    var fetcherEntry = fetcherEntry();
    fetcherEntry.setContent("fetcher content entry");
    var exclusionPattern = template.save(new ExclusionPattern("content", subscription1.getId(), 0, OffsetDateTime.now()));

    subscriptionEntryBatch.update(subscription1, fetcherEntry);

    assertThat(template.findById(exclusionPattern.getId(), ExclusionPattern.class))
      .hasFieldOrPropertyWithValue("hitCount", 1);
  }

  @Test
  void shouldUpdateSubscriptionWhenExcludedPatternInTitleFound() {
    var fetcherEntry = fetcherEntry();
    fetcherEntry.setTitle("fetcher title entry");
    template.save(new ExclusionPattern("title", subscription1.getId(), 0, OffsetDateTime.now()));

    subscriptionEntryBatch.update(subscription1, fetcherEntry);

    assertThat(template.findById(subscription1.getId(), Subscription.class))
      .hasFieldOrPropertyWithValue("acceptedFetchCount", 0);
    assertThat(findEntry(subscription1))
      .hasFieldOrPropertyWithValue("excluded", true);
  }

  @Test
  void shouldUpdateSubscriptionWhenExcludedPatternInContentFound() {
    var fetcherEntry = fetcherEntry();
    fetcherEntry.setTitle("fetcher content entry");
    template.save(new ExclusionPattern("content", subscription1.getId(), 0, OffsetDateTime.now()));

    subscriptionEntryBatch.update(subscription1, fetcherEntry);

    assertThat(template.findById(subscription1.getId(), Subscription.class))
      .hasFieldOrPropertyWithValue("acceptedFetchCount", 0);
    assertThat(findEntry(subscription1))
      .hasFieldOrPropertyWithValue("excluded", true);
  }

  @Test
  void shouldUpdateSubscriptionWhenExcludedPatternInUrlFound() {
    var fetcherEntry = fetcherEntry();
    fetcherEntry.setUrl("fetcher url entry");
    template.save(new ExclusionPattern("url", subscription1.getId(), 0, OffsetDateTime.now()));

    subscriptionEntryBatch.update(subscription1, fetcherEntry);

    assertThat(template.findById(subscription1.getId(), Subscription.class))
      .hasFieldOrPropertyWithValue("acceptedFetchCount", 0);
    assertThat(findEntry(subscription1))
      .hasFieldOrPropertyWithValue("excluded", true);
  }

  private SubscriptionEntry findEntry(Subscription subscription) {
    try {
      var id = jdbcTemplate.queryForObject(
        "select id from subscription_entry where subscription_id = :subscriptionId",
        Map.of("subscriptionId", subscription.getId()),
        Long.class
      );

      if (id == null) {
        return null;
      }

      return template.findById(id, SubscriptionEntry.class);
    } catch (EmptyResultDataAccessException exception) {
      return null;
    }
  }

  private FetcherEntry fetcherEntry() {
    var fetcherEntry = new FetcherEntry();
    fetcherEntry.setUrl("http://entryUrl");
    fetcherEntry.setFeedUrl("http://feedUrl");
    return fetcherEntry;
  }
}
