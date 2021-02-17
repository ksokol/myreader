package myreader.repository;

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
class SubscriptionEntryRepositoryTests {

  @Autowired
  private SubscriptionEntryRepository subscriptionEntryRepository;

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
    persistedEntry(subscription1);
    persistedEntry(subscription1);

    assertThat(subscriptionEntryRepository.countBySubscriptionId(subscription1.getId()))
      .isEqualTo(2);
  }

  @Test
  void shouldOrderEntriesByCreationDateDescending() {
    var entry1 = persistedEntry(subscription1);
    entry1.setCreatedAt(new Date(0));
    var entry2 = persistedEntry(subscription1);
    entry2.setCreatedAt(new Date(1));

    var actual = subscriptionEntryRepository.findBySubscriptionIdOrderByCreatedAtDesc(
      subscription1.getId(),
      PageRequest.of(0, 2)
    );

    assertThat(actual.getContent())
      .extracting("id")
      .containsExactly(entry2.getId(), entry1.getId());
  }

  @Test
  void shouldNotReturnFeedEntryIdWhenSubscriptionEntryIsNotRead() {
    persistedEntry(subscription1);

    var actual = subscriptionEntryRepository.findAllIdsBySubscriptionIdAndTagsIsEmptyAndCreatedAt(
      subscription1.getId(),
      toDate(now().plusDays(1)),
      PageRequest.of(0, 2));

    assertThat(actual.getContent())
      .isEmpty();
  }

  @Test
  void shouldNotReturnFeedEntryIdWhenSubscriptionEntryIsTaggedAndIsUnread() {
    var entry = persistedEntry(subscription1);
    entry.setTags(Collections.singleton("not null"));

    var actual = subscriptionEntryRepository.findAllIdsBySubscriptionIdAndTagsIsEmptyAndCreatedAt(
      subscription1.getId(),
      toDate(now().plusDays(1)),
      PageRequest.of(0, 2));

    assertThat(actual.getContent())
      .isEmpty();
  }

  @Test
  void shouldNotReturnFeedEntryIdWhenSubscriptionEntryIsTaggedAndIsRead() {
    var entry = persistedEntry(subscription1);
    entry.setTags(Set.of("some tag"));
    entry.setSeen(true);

    var actual = subscriptionEntryRepository.findAllIdsBySubscriptionIdAndTagsIsEmptyAndCreatedAt(
      subscription1.getId(),
      toDate(now().plusDays(1)),
      PageRequest.of(0, 2));

    assertThat(actual.getContent())
      .isEmpty();
  }

  @Test
  void shouldReturnFeedEntryIdWhenCreatedAtIsEarlierThanRetainDateAndSubscriptionEntryHasNoTagAndIsRead() {
    var entry = persistedEntry(subscription1);
    entry.setSeen(true);

    var actual = subscriptionEntryRepository.findAllIdsBySubscriptionIdAndTagsIsEmptyAndCreatedAt(
      subscription1.getId(),
      toDate(now().plusDays(1)),
      PageRequest.of(0, 2));

    assertThat(actual.getContent())
      .containsExactly(entry.getId());
  }

  @Test
  void shouldReturnUniqueFeedEntryIds() {
    var entry1 = persistedEntry(subscription1);
    var entry2 = persistedEntry(subscription2);
    entry1.setSeen(true);
    entry2.setSeen(true);

    var actual = subscriptionEntryRepository.findAllIdsBySubscriptionIdAndTagsIsEmptyAndCreatedAt(
      subscription1.getId(),
      toDate(now().plusDays(1)),
      PageRequest.of(0, 2));

    assertThat(actual.getContent())
      .containsExactly(entry1.getId());
  }

  @Test
  void shouldReturnFeedEntryIdWithoutSubscriptionEntry() {
    persistedEntry(subscription1);
    var entry2 = persistedEntry(subscription1);
    entry2.setSeen(true);

    var actual = subscriptionEntryRepository.findAllIdsBySubscriptionIdAndTagsIsEmptyAndCreatedAt(
      subscription1.getId(),
      toDate(now().plusDays(1)),
      PageRequest.of(0, 2));

    assertThat(actual.getContent())
      .containsExactly(entry2.getId());
  }

  @Test
  void shouldNotReturnFeedEntryIdWhenRetainDateIsEarlierThanCreatedAtAndSubscriptionEntryHasNoTagAndIsRead() {
    var entry = persistedEntry(subscription1);
    entry.setSeen(true);

    var actual = subscriptionEntryRepository.findAllIdsBySubscriptionIdAndTagsIsEmptyAndCreatedAt(
      subscription1.getId(),
      toDate(now().minusDays(1)),
      PageRequest.of(0, 2));

    assertThat(actual.getContent())
      .isEmpty();
  }

  private SubscriptionEntry persistedEntry(Subscription subscription) {
    return em.persist(new SubscriptionEntry(subscription));
  }

  private Date toDate(LocalDateTime localDateTime) {
    return Date.from(localDateTime.toInstant(ZoneOffset.UTC));
  }
}
