package myreader.repository;

import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.Date;
import java.util.Set;

import static java.time.LocalDateTime.now;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@DataJpaTest(showSql = false)
@WithTestProperties
class FeedEntryRepositoryTests {

  @Autowired
  private FeedEntryRepository feedEntryRepository;

  @Autowired
  private TestEntityManager em;

  private Subscription subscription1;
  private Subscription subscription2;

  @BeforeEach
  void setUp() {
    subscription1 = em.persist(new Subscription("http://example1.com", "feed1"));
    subscription2 = em.persist(new Subscription("http://example2.com", "feed2"));
  }

  @Test
  void shouldCountBySubscriptionId() {
    givenEntry(subscription1);
    givenEntry(subscription1);

    assertThat(feedEntryRepository.countBySubscriptionId(subscription1.getId())).isEqualTo(2);
  }

  @Test
  void shouldOrderEntriesByCreationDateDescending() {
    givenEntryWithTitleAndCreatedAt(subscription1, "entry1", new Date(0));
    givenEntryWithTitleAndCreatedAt(subscription1, "entry2", new Date(1));

    var actual = feedEntryRepository.findBySubscriptionIdOrderByCreatedAtDesc(
      subscription1.getId(),
      PageRequest.of(0, 2)
    );

    assertThat(actual.getContent())
      .extracting("title")
      .containsExactly("entry2", "entry1");
  }

  @Test
  void shouldNotReturnFeedEntryIdWhenSubscriptionEntryIsNotRead() {
    var entry = givenEntry(subscription1);
    givenSubscription1Entry(entry);

    var actual = feedEntryRepository.findErasableEntryIdsBySubscriptionIdAndCreatedAtEarlierThanRetainDate(
      subscription1.getId(),
      toDate(now().plusDays(1)),
      PageRequest.of(0, 2));

    assertThat(actual.getContent()).isEmpty();
  }

  @Test
  void shouldNotReturnFeedEntryIdWhenSubscriptionEntryIsTaggedAndIsUnread() {
    var entry = givenEntry(subscription1);
    givenSubscription1Entry(entry).setTags(Collections.singleton("not null"));

    var actual = feedEntryRepository.findErasableEntryIdsBySubscriptionIdAndCreatedAtEarlierThanRetainDate(
      subscription1.getId(),
      toDate(now().plusDays(1)),
      PageRequest.of(0, 2));

    assertThat(actual.getContent()).isEmpty();
  }

  @Test
  void shouldNotReturnFeedEntryIdWhenSubscriptionEntryIsTaggedAndIsRead() {
    var entry = givenEntry(subscription1);
    var subscriptionEntry = givenSubscription1Entry(entry);

    subscriptionEntry.setTags(Set.of("some tag"));
    subscriptionEntry.setSeen(true);

    var actual = feedEntryRepository.findErasableEntryIdsBySubscriptionIdAndCreatedAtEarlierThanRetainDate(
      subscription1.getId(),
      toDate(now().plusDays(1)),
      PageRequest.of(0, 2));

    assertThat(actual.getContent()).isEmpty();
  }

  @Test
  void shouldReturnFeedEntryIdWhenCreatedAtIsEarlierThanRetainDateAndSubscriptionEntryHasNoTagAndIsRead() {
    var entry = givenEntry(subscription1);
    givenSubscription1Entry(entry).setSeen(true);

    var actual = feedEntryRepository.findErasableEntryIdsBySubscriptionIdAndCreatedAtEarlierThanRetainDate(
      subscription1.getId(),
      toDate(now().plusDays(1)),
      PageRequest.of(0, 2));

    assertThat(actual.getContent()).containsExactly(entry.getId());
  }

  @Test
  void shouldReturnUniqueFeedEntryIds() {
    var entry = givenEntry(subscription1);
    givenSubscription1Entry(entry).setSeen(true);
    givenSubscription2Entry(entry).setSeen(true);

    var actual = feedEntryRepository.findErasableEntryIdsBySubscriptionIdAndCreatedAtEarlierThanRetainDate(
      subscription1.getId(),
      toDate(now().plusDays(1)),
      PageRequest.of(0, 2));

    assertThat(actual.getContent()).containsExactly(entry.getId());
  }

  @Test
  void shouldNotReturnFeedEntryIdWhenAtLeastOneSubscriptionEntryIsUnreadOrIsTagged() {
    var entry1 = givenEntry(subscription1);
    var entry2 = givenEntry(subscription1);
    givenSubscription1Entry(entry1).setSeen(true);
    givenSubscription2Entry(entry1);
    givenSubscription1Entry(entry2).setSeen(true);
    givenSubscription2Entry(entry2).setSeen(true);

    var actual = feedEntryRepository.findErasableEntryIdsBySubscriptionIdAndCreatedAtEarlierThanRetainDate(
      subscription1.getId(),
      toDate(now().plusDays(1)),
      PageRequest.of(0, 2));

    assertThat(actual.getContent()).containsExactly(entry2.getId());
  }

  @Test
  void shouldReturnFeedEntryIdWithoutSubscriptionEntry() {
    var entry1 = givenEntry(subscription1);
    var entry2 = givenEntry(subscription1);
    givenSubscription1Entry(entry1);

    var actual = feedEntryRepository.findErasableEntryIdsBySubscriptionIdAndCreatedAtEarlierThanRetainDate(
      subscription1.getId(),
      toDate(now().plusDays(1)),
      PageRequest.of(0, 2));

    assertThat(actual.getContent()).containsExactly(entry2.getId());
  }

  @Test
  void shouldNotReturnFeedEntryIdWhenRetainDateIsEarlierThanCreatedAtAndSubscriptionEntryHasNoTagAndIsRead() {
    var entry = givenEntry(subscription1);
    givenSubscription1Entry(entry).setSeen(true);

    var actual = feedEntryRepository.findErasableEntryIdsBySubscriptionIdAndCreatedAtEarlierThanRetainDate(
      subscription1.getId(),
      toDate(now().minusDays(1)),
      PageRequest.of(0, 2));

    assertThat(actual.getContent()).isEmpty();
  }

  private FeedEntry givenEntry(Subscription subscription) {
    var feedEntry = new FeedEntry(subscription);
    return em.persist(feedEntry);
  }

  private void givenEntryWithTitleAndCreatedAt(Subscription subscription, String title, Date createdAt) {
    var feedEntry = new FeedEntry(subscription);
    feedEntry.setTitle(title);
    feedEntry.setCreatedAt(createdAt);
    em.persist(feedEntry);
  }

  private SubscriptionEntry givenSubscription1Entry(FeedEntry feedEntry) {
    var subscriptionEntry = new SubscriptionEntry(subscription1, feedEntry);
    return em.persist(subscriptionEntry);
  }

  private SubscriptionEntry givenSubscription2Entry(FeedEntry feedEntry) {
    var subscriptionEntry = new SubscriptionEntry(subscription2, feedEntry);
    return em.persist(subscriptionEntry);
  }

  private Date toDate(LocalDateTime localDateTime) {
    return Date.from(localDateTime.toInstant(ZoneOffset.UTC));
  }
}
