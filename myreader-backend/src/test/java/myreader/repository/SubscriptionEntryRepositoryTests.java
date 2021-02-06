package myreader.repository;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.test.ClearDb;
import myreader.test.WithTestProperties;
import org.hibernate.search.jpa.Search;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Slice;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.Arrays;
import java.util.HashSet;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.emptyIterable;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;

@ExtendWith(SpringExtension.class)
@Transactional(propagation = Propagation.SUPPORTS)
@ClearDb
@DataJpaTest(showSql = false)
@WithTestProperties
class SubscriptionEntryRepositoryTests {

  @Autowired
  private SubscriptionEntryRepository subscriptionEntryRepository;

  @Autowired
  private TestEntityManager em;

  @Autowired
  private TransactionTemplate tx;

  private Slice<SubscriptionEntry> slice;
  private Subscription subscription1;
  private Subscription subscription2;
  private SubscriptionEntry subscriptionEntry1;
  private SubscriptionEntry subscriptionEntry2;
  private SubscriptionEntry subscriptionEntry3;
  private SubscriptionEntry subscriptionEntry4;

  @BeforeEach
  void setUp() {
    tx.execute(status -> {
      var feed1 = em.persist(new Feed("irrelevant", "irrelevant"));
      var feed2 = em.persist(new Feed("irrelevant", "irrelevant"));

      subscription1 = em.persist(new Subscription(feed1));
      subscription2 = em.persist(new Subscription(feed2));

      var feedEntry1 = new FeedEntry(feed1);
      feedEntry1.setTitle("some entry1 title");
      feedEntry1.setContent("some entry1 content");
      feedEntry1 = em.persistAndFlush(feedEntry1);

      var feedEntry2 = new FeedEntry(feed1);
      feedEntry2.setTitle("some entry2 title");
      feedEntry2.setContent("some entry2 content");
      feedEntry2 = em.persistAndFlush(feedEntry2);

      subscriptionEntry1 = new SubscriptionEntry(subscription1, feedEntry1);
      subscriptionEntry1.setTags(new HashSet<>(Arrays.asList("tag1", "tag2", "tag3")));
      subscriptionEntry1.setSeen(true);

      subscriptionEntry2 = new SubscriptionEntry(subscription2, feedEntry2);
      subscriptionEntry2.setTags(new HashSet<>(Arrays.asList("tag2-tag3", "tag4 tag5", "tag6,tag7", "tag8Tag9")));

      subscriptionEntry1 = em.persistAndFlush(subscriptionEntry1);
      subscriptionEntry2 = em.persistAndFlush(new SubscriptionEntry(subscription1, feedEntry1));
      subscriptionEntry3 = em.persistAndFlush(new SubscriptionEntry(subscription1, feedEntry1));
      subscriptionEntry4 = em.persistAndFlush(new SubscriptionEntry(subscription1, feedEntry1));
      em.persistAndFlush(subscriptionEntry2);
      return null;
    });

    tx.execute(s -> {
      try {
        Search.getFullTextEntityManager(em.getEntityManager()).createIndexer().startAndWait();
      } catch (InterruptedException exception) {
        throw new AssertionError(exception);
      }
      return null;
    });
  }

  @Test
  void searchPaginated() {
    givenQuery(null, null, null, null, 10);
    assertThat(slice.getNumberOfElements(), is(4));

    givenQuery(null, null, null, null, 1);
    assertThat(slice.getContent().get(0).getId(), is(subscriptionEntry4.getId()));
    assertThat(slice.hasNext(), is(true));

    givenQuery(null, null, null, subscriptionEntry4.getId(), 1);
    assertThat(slice.getContent().get(0).getId(), is(subscriptionEntry3.getId()));
    assertThat(slice.hasNext(), is(true));
  }

  @Test
  void searchNextPage() {
    givenQuery(null, null, null, 1582801646000L, 1);
    assertThat(slice.getContent(), everyItem(hasProperty("id", is(subscriptionEntry4.getId()))));
    assertThat(slice.hasNext(), is(true));
  }

  @Test
  void seenEqualFalse() {
    givenQuery(null, null, "false", null, 10);
    assertThat(slice.getContent(), hasSize(3));
  }

  @Test
  void seenEqualTrue() {
    givenQuery(null, null, "true", null, 10);
    assertThat(slice.getContent(), hasSize(1));
  }

  @Test
  void seenEqualWildcard() {
    givenQuery(null, null, "*", null, 10);
    assertThat(slice.getContent(), hasSize(4));
  }

  @Test
  void feedUuidEqual14() {
    givenQuery(subscription1.getId().toString(), null, null, null, 10);
    assertThat(slice.getContent(), hasSize(4));
  }

  @Test
  void feedUuidEqual9114() {
    givenQuery("9114", null, null, null, 10);
    assertThat(slice.getContent(), hasSize(0));
  }

  @Test
  void feedTagEqualUnknown() {
    givenQuery(null, "unknown", null, null, 10);
    assertThat(slice.getContent(), hasSize(0));
  }

  @Test
  void feedTagEqualTag1() {
    givenQuery(null, "tag1", null, null, 10);
    assertThat(slice.getContent(), everyItem(hasProperty("id", is(subscriptionEntry1.getId()))));
  }

  @Test
  @Transactional(propagation = Propagation.NOT_SUPPORTED)
  void shouldPaginateWithChangingSeenValues() {
    tx.execute(s -> givenQuery(null, null, "false", null, 2));

    assertThat(slice.getContent(), hasItems(
      allOf(hasProperty("id", is(subscriptionEntry4.getId())), hasProperty("seen", is(false))),
      allOf(hasProperty("id", is(subscriptionEntry3.getId())), hasProperty("seen", is(false)))
    ));

    tx.execute(s -> {
      var subscriptionEntry = em.find(SubscriptionEntry.class, subscriptionEntry4.getId());
      subscriptionEntry.setSeen(true);
      return em.persistFlushFind(subscriptionEntry);
    });

    tx.execute(s -> givenQuery(null, null, null, null, 10));
    assertThat(slice.getContent(), hasItems(
      allOf(hasProperty("id", is(subscriptionEntry4.getId())), hasProperty("seen", is(true))),
      allOf(hasProperty("id", is(subscriptionEntry3.getId())), hasProperty("seen", is(false))),
      allOf(hasProperty("id", is(subscriptionEntry2.getId())), hasProperty("seen", is(false))),
      allOf(hasProperty("id", is(subscriptionEntry1.getId())), hasProperty("seen", is(true)))
    ));

    tx.execute(s -> givenQuery(null, null, "false", subscriptionEntry4.getId(), 2));
    assertThat(slice.getContent(), contains(
      hasProperty("id", is(subscriptionEntry3.getId())),
      hasProperty("id", is(subscriptionEntry2.getId())))
    );

    tx.execute(s -> {
      SubscriptionEntry subscriptionEntry = em.find(SubscriptionEntry.class, subscriptionEntry2.getId());
      subscriptionEntry.setSeen(true);
      return em.persistFlushFind(subscriptionEntry);
    });

    tx.execute(s -> givenQuery(null, null, null, null, 10));
    assertThat(slice.getContent(), hasItems(
      allOf(hasProperty("id", is(subscriptionEntry4.getId())), hasProperty("seen", is(true))),
      allOf(hasProperty("id", is(subscriptionEntry3.getId())), hasProperty("seen", is(false))),
      allOf(hasProperty("id", is(subscriptionEntry2.getId())), hasProperty("seen", is(true))),
      allOf(hasProperty("id", is(subscriptionEntry1.getId())), hasProperty("seen", is(true)))
    ));

    tx.execute(s -> givenQuery(null, null, "false", subscriptionEntry2.getId(), 2));
    assertThat(slice.getContent(), emptyIterable());
  }

  private Slice<SubscriptionEntry> givenQuery(String feedId, String feedTagEqual, String seen, Long next, int size) {
    slice = subscriptionEntryRepository.findBy(
      size,
      feedId,
      feedTagEqual,
      null,
      seen,
      next
    );
    return slice;
  }
}
