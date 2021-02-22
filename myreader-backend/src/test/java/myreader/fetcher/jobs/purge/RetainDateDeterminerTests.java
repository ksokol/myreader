package myreader.fetcher.jobs.purge;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jdbc.core.JdbcAggregateOperations;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

import static myreader.test.OffsetDateTimes.ofEpochMilli;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@Transactional
@SpringBootTest
@WithTestProperties
@TestPropertySource(properties = "myreader.min-feed-threshold=2")
class RetainDateDeterminerTests {

  @Autowired
  private JdbcAggregateOperations template;

  @Autowired
  private RetainDateDeterminer determiner;

  private Subscription subscription1;
  private Subscription subscription2;

  @BeforeEach
  void setUp() {
    subscription1 = template.save(new Subscription(
      "url1",
      "title1",
      null,
      null,
      0,
      null,
      0,
      5,
      ofEpochMilli(1000)
    ));

    subscription2 = template.save(new Subscription(
      "url2",
      "title2",
      null,
      null,
      0,
      null,
      0,
      5,
      ofEpochMilli(1000)
    ));
  }

  @Test
  void shouldNotDetermineRetainDateWhenEntryCountIsBelowThreshold() {
    createEntries(subscription1, 2);

    assertThat(determiner.determine(subscription1))
      .isNotPresent();
  }

  @Test
  void shouldNotDetermineRetainDateWhenEntryCountIsEqualToThreshold() {
    createEntries(subscription1, 5);

    assertThat(determiner.determine(subscription1))
      .isNotPresent();
  }

  @Test
  void shouldDetermineRetainDateForSubscription1() {
    createEntries(subscription1, 9);
    createEntries(subscription2, 11);

    assertThat(determiner.determine(subscription1))
      .isPresent()
      .hasValue(new Date(9000L));
  }

  @Test
  void shouldDetermineRetainDateForSubscription2() {
    createEntries(subscription1, 9);
    createEntries(subscription2, 11);

    assertThat(determiner.determine(subscription2))
      .isPresent()
      .hasValue(new Date(11000L));
  }

  private void createEntries(Subscription subscription, int index) {
    for (int i = 0; i < index; i++) {
      template.save(new SubscriptionEntry(
        null,
        null,
        "url",
        null,
        false,
        false,
        null,
        subscription.getId(),
        ofEpochMilli(index * 1000L)
        ));
    }
  }
}
