package myreader.repository;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.entity.User;
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

import static myreader.test.TestUser.USER1;
import static myreader.test.TestUser.USER4;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.emptyIterable;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasItem;
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
    private User user1;
    private User user2;
    private Subscription user1Subscription;
    private Subscription user2Subscription;
    private SubscriptionEntry user1SubscriptionEntry1;
    private SubscriptionEntry user1SubscriptionEntry2;
    private SubscriptionEntry user1SubscriptionEntry3;
    private SubscriptionEntry user1SubscriptionEntry4;
    private SubscriptionEntry user2SubscriptionEntry;

    @BeforeEach
    void setUp() {
        tx.execute(status -> {
            user1 = em.persist(USER1.toUser());
            user2 = em.persist(USER4.toUser());

            var feed1 = em.persist(new Feed("irrelevant", "irrelevant"));
            var feed2 = em.persist(new Feed("irrelevant", "irrelevant"));

            user1Subscription = em.persist(new Subscription(user1, feed1));
            user2Subscription = em.persist(new Subscription(user2, feed2));

            var feedEntry1 = new FeedEntry(feed1);
            feedEntry1.setTitle("some entry1 title");
            feedEntry1.setContent("some entry1 content");
            feedEntry1 = em.persistAndFlush(feedEntry1);

            var feedEntry2 = new FeedEntry(feed1);
            feedEntry2.setTitle("some entry2 title");
            feedEntry2.setContent("some entry2 content");
            feedEntry2 = em.persistAndFlush(feedEntry2);

            var subscriptionEntry1 = new SubscriptionEntry(user1Subscription, feedEntry1);
            subscriptionEntry1.setTags(new HashSet<>(Arrays.asList("tag1", "tag2", "tag3")));
            subscriptionEntry1.setSeen(true);

            var subscriptionEntry2 = new SubscriptionEntry(user2Subscription, feedEntry2);
            subscriptionEntry2.setTags(new HashSet<>(Arrays.asList("tag2-tag3", "tag4 tag5", "tag6,tag7", "tag8Tag9")));

            user1SubscriptionEntry1 = em.persistAndFlush(subscriptionEntry1);
            user1SubscriptionEntry2 = em.persistAndFlush(new SubscriptionEntry(user1Subscription, feedEntry1));
            user1SubscriptionEntry3 = em.persistAndFlush(new SubscriptionEntry(user1Subscription, feedEntry1));
            user1SubscriptionEntry4 = em.persistAndFlush(new SubscriptionEntry(user1Subscription, feedEntry1));
            user2SubscriptionEntry = em.persistAndFlush(subscriptionEntry2);
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
    void searchSubscriptionEntryByTitle() {
        givenQuery("entry title", null, null, null, null, null, 10, user1.getId());
        assertThat(slice.getContent(), everyItem(hasProperty("id", is(user1SubscriptionEntry1.getId()))));
    }

    @Test
    void searchSubscriptionEntryByContent() {
        givenQuery("entry content", null, null, null, null, null, 10, user1.getId());
        assertThat(slice.getContent(), everyItem(hasProperty("id", is(user1SubscriptionEntry1.getId()))));
    }

    @Test
    void searchPaginated() {
        givenQuery(null, null, null, null, null, null, 10, user1.getId());
        assertThat(slice.getNumberOfElements(), is(4));

        givenQuery(null, null, null, null, null, null, 1, user1.getId());
        assertThat(slice.getContent().get(0).getId(), is(user1SubscriptionEntry4.getId()));
        assertThat(slice.hasNext(), is(true));

        givenQuery(null, null, null, null, null, user1SubscriptionEntry4.getId(), 1, user1.getId());
        assertThat(slice.getContent().get(0).getId(), is(user1SubscriptionEntry3.getId()));
        assertThat(slice.hasNext(), is(true));
    }

    @Test
    void searchNextPage() {
        givenQuery(null, null, null, null, null, 1582801646000L, 1, user1.getId());
        assertThat(slice.getContent(), everyItem(hasProperty("id", is(user1SubscriptionEntry4.getId()))));
        assertThat(slice.hasNext(), is(true));
    }

    @Test
    void searchSubscriptionEntryByTag() {
        givenQuery("tag2", null, null, null, null, null, 10, user1.getId());
        assertThat(slice.getContent(), contains(hasProperty("id", is(user1SubscriptionEntry1.getId()))));
    }

    @Test
    void seenEqualFalse() {
        givenQuery(null, null, null, null, "false", null, 10, user1.getId());
        assertThat(slice.getContent(), hasSize(3));
    }

    @Test
    void seenEqualTrue() {
        givenQuery(null, null, null, null, "true", null, 10, user2.getId());
        assertThat(slice.getContent(), hasSize(0));
    }

    @Test
    void seenEqualWildcard() {
        givenQuery(null, null, null, null, "*", null, 10, user1.getId());
        assertThat(slice.getContent(), hasSize(4));
    }

    @Test
    void feedUuidEqual14() {
        givenQuery(null, user1Subscription.getId().toString(), null, null, null, null, 10, user1.getId());
        assertThat(slice.getContent(), hasSize(4));
    }

    @Test
    void feedUuidEqual9114() {
        givenQuery(null, "9114", null, null, null, null, 10, user1.getId());
        assertThat(slice.getContent(), hasSize(0));
    }

    @Test
    void feedTagEqualUnknown() {
        givenQuery(null, null, "unknown", null, null, null, 10, user1.getId());
        assertThat(slice.getContent(), hasSize(0));
    }

    @Test
    void feedTagEqualTag1() {
        givenQuery(null, null, "tag1", null, null, null, 10, user1.getId());
        assertThat(slice.getContent(), everyItem(hasProperty("id", is(user1SubscriptionEntry1.getId()))));
    }

    @Test
    void entryTagEqualTag2Tag3() {
        givenQuery(null, null, null, "tag2", null, null, 10, user2.getId());
        assertThat(slice.getContent(), hasSize(0));

        givenQuery(null, null, null, "tag2-tag3", null, null, 10, user2.getId());
        assertThat(slice.getContent().get(0).getId(), is(user2SubscriptionEntry.getId()));
        assertThat(slice.getContent().get(0).getTags(), hasItem("tag2-tag3"));
    }

    @Test
    void entryTagEqualTag4AndTag5() {
        givenQuery(null, null, null, "tag4", null, null, 10, user2.getId());

        givenQuery(null, null, null, "tag4 tag5", null, null, 10, user2.getId());
        assertThat(slice.getContent(), hasSize(1));
        assertThat(slice.getContent().get(0).getId(), is(user2SubscriptionEntry.getId()));
        assertThat(slice.getContent().get(0).getTags(), hasItem("tag4 tag5"));
    }

    @Test
    void entryTagEqualTag6AndTag7() {
        givenQuery(null, null, null, "tag6", null, null, 10, user2.getId());
        assertThat(slice.getContent(), hasSize(0));

        givenQuery(null, null, null, "tag6,tag7", null, null, 10, user2.getId());
        assertThat(slice.getContent(), hasSize(1));
        assertThat(slice.getContent().get(0).getId(), is(user2SubscriptionEntry.getId()));
        assertThat(slice.getContent().get(0).getTags(), hasItem("tag6,tag7"));
    }

    @Test
    void entryTagEqualTag8Tag9() {
        givenQuery(null, null, null, "tag8tag9", null, null, 10, user2.getId());
        assertThat(slice.getContent(), hasSize(0));

        givenQuery(null, null, null, "tag8Tag9", null, null, 10, user2.getId());
        assertThat(slice.getContent().get(0).getId(), is(user2SubscriptionEntry.getId()));
        assertThat(slice.getContent().get(0).getTags(), hasItem("tag8Tag9"));
    }

    @Test
    void shouldAppendAsteriskToSearchParameterWhenSearchParameterDoesNotEndWithAsterisk() {
        givenQuery("entry", null, null, null, "*", null, 10, user1.getId());
        assertThat(slice.getContent(), hasSize(4));

        givenQuery("entry*", null, null, null, "*", null, 10, user1.getId());
        assertThat(slice.getContent(), hasSize(4));
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void shouldPaginateWithChangingSeenValues() {
        tx.execute(s -> givenQuery(null, null, null, null, "false", null, 2, user1.getId()));

        assertThat(slice.getContent(), hasItems(
                allOf(hasProperty("id", is(user1SubscriptionEntry4.getId())), hasProperty("seen", is(false))),
                allOf(hasProperty("id", is(user1SubscriptionEntry3.getId())), hasProperty("seen", is(false)))
        ));

        tx.execute(s -> {
            var subscriptionEntry = em.find(SubscriptionEntry.class, user1SubscriptionEntry4.getId());
            subscriptionEntry.setSeen(true);
            return em.persistFlushFind(subscriptionEntry);
        });

        tx.execute(s -> givenQuery(null, null, null, null, null, null, 10, user1.getId()));
        assertThat(slice.getContent(), hasItems(
                allOf(hasProperty("id", is(user1SubscriptionEntry4.getId())), hasProperty("seen", is(true))),
                allOf(hasProperty("id", is(user1SubscriptionEntry3.getId())), hasProperty("seen", is(false))),
                allOf(hasProperty("id", is(user1SubscriptionEntry2.getId())), hasProperty("seen", is(false))),
                allOf(hasProperty("id", is(user1SubscriptionEntry1.getId())), hasProperty("seen", is(true)))
        ));

        tx.execute(s -> givenQuery(null, null, null, null, "false", user1SubscriptionEntry4.getId(), 2, user1.getId()));
        assertThat(slice.getContent(), contains(
                hasProperty("id", is(user1SubscriptionEntry3.getId())),
                hasProperty("id", is(user1SubscriptionEntry2.getId())))
        );

        tx.execute(s -> {
            SubscriptionEntry subscriptionEntry = em.find(SubscriptionEntry.class, user1SubscriptionEntry2.getId());
            subscriptionEntry.setSeen(true);
            return em.persistFlushFind(subscriptionEntry);
        });

        tx.execute(s -> givenQuery(null, null, null, null, null, null, 10, user1.getId()));
        assertThat(slice.getContent(), hasItems(
                allOf(hasProperty("id", is(user1SubscriptionEntry4.getId())), hasProperty("seen", is(true))),
                allOf(hasProperty("id", is(user1SubscriptionEntry3.getId())), hasProperty("seen", is(false))),
                allOf(hasProperty("id", is(user1SubscriptionEntry2.getId())), hasProperty("seen", is(true))),
                allOf(hasProperty("id", is(user1SubscriptionEntry1.getId())), hasProperty("seen", is(true)))
        ));

        tx.execute(s -> givenQuery(null, null, null, null, "false", user1SubscriptionEntry2.getId(), 2, user1.getId()));
        assertThat(slice.getContent(), emptyIterable());
    }

    private Slice<SubscriptionEntry> givenQuery(String q, String feedId, String feedTagEqual, String entryTagEqual, String seen, Long next, int size, long userId) {
        slice = subscriptionEntryRepository.findBy(
                size,
                q,
                feedId,
                feedTagEqual,
                entryTagEqual,
                seen,
                next,
                userId
        );
        return slice;
    }
}
