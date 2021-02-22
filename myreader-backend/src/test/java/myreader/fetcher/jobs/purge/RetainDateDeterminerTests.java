package myreader.fetcher.jobs.purge;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jdbc.core.JdbcAggregateOperations;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.transaction.Transactional;
import java.util.Date;

import static myreader.test.OffsetDateTimes.ofEpochMilli;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@AutoConfigureTestEntityManager
@Transactional
@SpringBootTest
@WithTestProperties
@TestPropertySource(properties = "myreader.min-feed-threshold=2")
class RetainDateDeterminerTests {

  @Autowired
  private JdbcAggregateOperations template;

  @Autowired
  private TestEntityManager em;

  @Autowired
  private RetainDateDeterminer determiner;

  private Subscription subscription1;
  private Subscription subscription2;

  @BeforeEach
  void setUp() {
    subscription1 = new Subscription("url1", "title1");
    subscription1.setResultSizePerFetch(5);
    subscription1 = em.persist(subscription1);

    subscription2 = new Subscription("url2", "title2");
    subscription2.setResultSizePerFetch(5);
    subscription2 = em.persist(subscription2);
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
