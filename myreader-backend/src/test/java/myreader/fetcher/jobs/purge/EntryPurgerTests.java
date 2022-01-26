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

import java.time.OffsetDateTime;
import java.util.Collections;

import static myreader.test.OffsetDateTimes.ofEpochMilli;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@Transactional
@SpringBootTest
@WithTestProperties
@TestPropertySource(properties = "myreader.min-feed-threshold=2")
class EntryPurgerTests {

  @Autowired
  private JdbcAggregateOperations template;

  @Autowired
  private EntryPurger purger;

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
      false,
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
      false,
      ofEpochMilli(1000)
    ));
  }

  @Test
  void shouldNotDeleteEntriesIfUnseen() {
    createEntry(ofEpochMilli(1000));
    createEntry(ofEpochMilli(2000));

    purger.purge(subscription1.getId(), ofEpochMilli(5000));

    assertThat(template.count(SubscriptionEntry.class))
      .isEqualTo(2);
  }

  @Test
  void shouldNotDeleteEntriesIfTaggedAndSeen() {
    var subscriptionEntry1 = createEntry(ofEpochMilli(1000));
    subscriptionEntry1.setSeen(true);
    subscriptionEntry1.setTags(Collections.singleton("not null"));
    template.save(subscriptionEntry1);

    var subscriptionEntry2 = createEntry(ofEpochMilli(2000));
    subscriptionEntry2.setSeen(true);
    subscriptionEntry2.setTags(Collections.singleton("not null"));
    template.save(subscriptionEntry2);

    purger.purge(subscription1.getId(), ofEpochMilli(5000));

    assertThat(template.count(SubscriptionEntry.class))
      .isEqualTo(2);
  }

  @Test
  void shouldNotDeleteEntriesIfTagged() {
    var subscriptionEntry1 = createEntry(ofEpochMilli(1000));
    subscriptionEntry1.setTags(Collections.singleton("not null"));
    template.save(subscriptionEntry1);

    var subscriptionEntry2 = createEntry(ofEpochMilli(2000));
    subscriptionEntry2.setTags(Collections.singleton("not null"));
    template.save(subscriptionEntry2);

    purger.purge(subscription1.getId(), ofEpochMilli(5000));

    assertThat(template.count(SubscriptionEntry.class))
      .isEqualTo(2);
  }

  @Test
  void shouldNotDeleteEntriesFromSubscriptionIfRetainDateNotReached() {
    var subscriptionEntry1 = createEntry(ofEpochMilli(10000));
    subscriptionEntry1.setSeen(true);
    template.save(subscriptionEntry1);

    var subscriptionEntry2 = createEntry(ofEpochMilli(20000));
    subscriptionEntry2.setSeen(true);
    template.save(subscriptionEntry2);

    purger.purge(subscription1.getId(), ofEpochMilli(5000));

    assertThat(template.count(SubscriptionEntry.class))
      .isEqualTo(2L);
  }

  @Test
  void shouldDeleteOldEntriesFromSubscription1() {
    var subscriptionEntry1 = createEntry(ofEpochMilli(1000));
    subscriptionEntry1.setSeen(true);
    template.save(subscriptionEntry1);

    var subscriptionEntry2 = createEntry(subscription2, ofEpochMilli(2000));
    subscriptionEntry2.setSeen(true);
    template.save(subscriptionEntry2);

    purger.purge(subscription1.getId(), ofEpochMilli(5000));

    assertThat(template.findAll(SubscriptionEntry.class))
      .hasSize(1)
      .element(0)
      .hasFieldOrPropertyWithValue("id", subscriptionEntry2.getId());
  }

  private SubscriptionEntry createEntry(OffsetDateTime createdAt) {
    return createEntry(subscription1, createdAt);
  }

  private SubscriptionEntry createEntry(Subscription Subscription, OffsetDateTime createdAt) {
    var subscriptionEntry1 = new SubscriptionEntry(
      null,
      null,
      "url",
      null,
      false,
      false,
      null,
      Subscription.getId(),
      createdAt
    );
    return template.save(subscriptionEntry1);
  }

}
