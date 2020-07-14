package myreader.repository;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.entity.User;
import myreader.test.WithTestProperties;
import org.hibernate.search.jpa.Search;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Slice;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

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
import static org.hamcrest.Matchers.not;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@Transactional(propagation = Propagation.SUPPORTS)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@DataJpaTest(showSql = false)
@WithTestProperties
public class SubscriptionEntryRepositoryTests {

    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;

    @Autowired
    private TestEntityManager testEntityManager;

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

    @Before
    public void setUp() {
        tx.execute(s -> {
            user1 = testEntityManager.persistFlushFind(new User("irrelevant"));
            user2 = testEntityManager.persistFlushFind(new User("irrelevant"));

            Feed feed1 = testEntityManager.persistFlushFind(new Feed("irrelevant", "irrelevant"));
            Feed feed2 = testEntityManager.persistFlushFind(new Feed("irrelevant", "irrelevant"));

            user1Subscription = testEntityManager.persistFlushFind(new Subscription(user1, feed1));
            user2Subscription = testEntityManager.persistFlushFind(new Subscription(user2, feed2));

            FeedEntry feedEntry1 = new FeedEntry(feed1);
            feedEntry1.setTitle("some entry1 title");
            feedEntry1.setContent("some entry1 content");
            feedEntry1 = testEntityManager.persistAndFlush(feedEntry1);

            FeedEntry feedEntry2 = new FeedEntry(feed1);
            feedEntry2.setTitle("some entry2 title");
            feedEntry2.setContent("some entry2 content");
            feedEntry2 = testEntityManager.persistAndFlush(feedEntry2);

            SubscriptionEntry subscriptionEntry1 = new SubscriptionEntry(user1Subscription, feedEntry1);
            subscriptionEntry1.setTags(new HashSet<>(Arrays.asList("tag1", "tag2", "tag3")));
            subscriptionEntry1.setSeen(true);

            SubscriptionEntry subscriptionEntry2 = new SubscriptionEntry(user2Subscription, feedEntry2);
            subscriptionEntry2.setTags(new HashSet<>(Arrays.asList("tag2-tag3", "tag4 tag5", "tag6,tag7", "tag8Tag9")));

            user1SubscriptionEntry1 = testEntityManager.persistAndFlush(subscriptionEntry1);
            user1SubscriptionEntry2 = testEntityManager.persistAndFlush(new SubscriptionEntry(user1Subscription, feedEntry1));
            user1SubscriptionEntry3 = testEntityManager.persistAndFlush(new SubscriptionEntry(user1Subscription, feedEntry1));
            user1SubscriptionEntry4 = testEntityManager.persistAndFlush(new SubscriptionEntry(user1Subscription, feedEntry1));
            user2SubscriptionEntry = testEntityManager.persistAndFlush(subscriptionEntry2);
            return null;
        });

        tx.execute(s -> {
            try {
                Search.getFullTextEntityManager(testEntityManager.getEntityManager()).createIndexer().startAndWait();
            } catch (InterruptedException exception) {
                throw new AssertionError(exception);
            }
            return null;
        });
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public void shouldFindTagsForGivenUser() {
        Set<String> actualTagsForUser1 = subscriptionEntryRepository.findDistinctTagsByUserId(user1.getId());
        assertThat(actualTagsForUser1, contains("tag1", "tag2", "tag3"));

        Set<String> actualTagsForUser2 = subscriptionEntryRepository.findDistinctTagsByUserId(user2.getId());
        assertThat(actualTagsForUser2, contains("tag2-tag3", "tag4 tag5", "tag6,tag7", "tag8Tag9"));
    }

    @Test
    public void shouldSearchForGivenUser() {
        givenQuery(null, null, null, null, null, null, 100, user1.getId());
        assertThat(slice.getContent(), hasItem(hasProperty("id", is(user1SubscriptionEntry1.getId()))));
        assertThat(slice.getContent(), not(hasItem(hasProperty("id", is(user2SubscriptionEntry.getId())))));

        givenQuery(null, null, null, null, null, null, 100, user2.getId());
        assertThat(slice.getContent(), hasItem(hasProperty("id", is(user2SubscriptionEntry.getId()))));
        assertThat(slice.getContent(), not(hasItem(hasProperty("id", is(user1SubscriptionEntry1.getId())))));
    }

    @Test
    public void searchWithPageSizeOne() {
        givenQuery(null, null, null, null, null, null, 1, user1.getId());
        assertThat(slice.getContent(), everyItem(hasProperty("id", is(user1SubscriptionEntry4.getId()))));
    }

    @Test
    public void searchSubscriptionEntryByTitle() {
        givenQuery("entry title", null, null, null, null, null, 10, user1.getId());
        assertThat(slice.getContent(), everyItem(hasProperty("id", is(user1SubscriptionEntry1.getId()))));
    }

    @Test
    public void searchSubscriptionEntryByContent() {
        givenQuery("entry content", null, null, null, null, null, 10, user1.getId());
        assertThat(slice.getContent(), everyItem(hasProperty("id", is(user1SubscriptionEntry1.getId()))));
    }

    @Test
    public void searchPaginated() {
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
    public void searchNextPage() {
        givenQuery(null, null, null, null, null, 1582801646000L, 1, user1.getId());
        assertThat(slice.getContent(), everyItem(hasProperty("id", is(user1SubscriptionEntry4.getId()))));
        assertThat(slice.hasNext(), is(true));
    }

    @Test
    public void searchSubscriptionEntryByTag() {
        givenQuery("tag2", null, null, null, null, null, 10, user1.getId());
        assertThat(slice.getContent(), contains(hasProperty("id", is(user1SubscriptionEntry1.getId()))));
    }

    @Test
    public void seenEqualFalse() {
        givenQuery(null, null, null, null, "false", null, 10, user1.getId());
        assertThat(slice.getContent(), hasSize(3));
    }

    @Test
    public void seenEqualTrue() {
        givenQuery(null, null, null, null, "true", null, 10, user2.getId());
        assertThat(slice.getContent(), hasSize(0));
    }

    @Test
    public void seenEqualWildcard() {
        givenQuery(null, null, null, null, "*", null, 10, user1.getId());
        assertThat(slice.getContent(), hasSize(4));
    }

    @Test
    public void feedUuidEqual14() {
        givenQuery(null, user1Subscription.getId().toString(), null, null, null, null, 10, user1.getId());
        assertThat(slice.getContent(), hasSize(4));
    }

    @Test
    public void feedUuidEqual9114() {
        givenQuery(null, "9114", null, null, null, null, 10, user1.getId());
        assertThat(slice.getContent(), hasSize(0));
    }

    @Test
    public void feedTagEqualUnknown() {
        givenQuery(null, null, "unknown", null, null, null, 10, user1.getId());
        assertThat(slice.getContent(), hasSize(0));
    }

    @Test
    public void feedTagEqualTag1() {
        givenQuery(null, null, "tag1", null, null, null, 10, user1.getId());
        assertThat(slice.getContent(), everyItem(hasProperty("id", is(user1SubscriptionEntry1.getId()))));
    }

    @Test
    public void entryTagEqualTag2Tag3() {
        givenQuery(null, null, null, "tag2", null, null, 10, user2.getId());
        assertThat(slice.getContent(), hasSize(0));

        givenQuery(null, null, null, "tag2-tag3", null, null, 10, user2.getId());
        assertThat(slice.getContent().get(0).getId(), is(user2SubscriptionEntry.getId()));
        assertThat(slice.getContent().get(0).getTags(), hasItem("tag2-tag3"));
    }

    @Test
    public void entryTagEqualTag4AndTag5() {
        givenQuery(null, null, null, "tag4", null, null, 10, user2.getId());

        givenQuery(null, null, null, "tag4 tag5", null, null, 10, user2.getId());
        assertThat(slice.getContent(), hasSize(1));
        assertThat(slice.getContent().get(0).getId(), is(user2SubscriptionEntry.getId()));
        assertThat(slice.getContent().get(0).getTags(), hasItem("tag4 tag5"));
    }

    @Test
    public void entryTagEqualTag6AndTag7() {
        givenQuery(null, null, null, "tag6", null, null, 10, user2.getId());
        assertThat(slice.getContent(), hasSize(0));

        givenQuery(null, null, null, "tag6,tag7", null, null, 10, user2.getId());
        assertThat(slice.getContent(), hasSize(1));
        assertThat(slice.getContent().get(0).getId(), is(user2SubscriptionEntry.getId()));
        assertThat(slice.getContent().get(0).getTags(), hasItem("tag6,tag7"));
    }

    @Test
    public void entryTagEqualTag8Tag9() {
        givenQuery(null, null, null, "tag8tag9", null, null, 10, user2.getId());
        assertThat(slice.getContent(), hasSize(0));

        givenQuery(null, null, null, "tag8Tag9", null, null, 10, user2.getId());
        assertThat(slice.getContent().get(0).getId(), is(user2SubscriptionEntry.getId()));
        assertThat(slice.getContent().get(0).getTags(), hasItem("tag8Tag9"));
    }

    @Test
    public void shouldAppendAsteriskToSearchParameterWhenSearchParameterDoesNotEndWithAsterisk() {
        givenQuery("entry", null, null, null, "*", null, 10, user1.getId());
        assertThat(slice.getContent(), hasSize(4));

        givenQuery("entry*", null, null, null, "*", null, 10, user1.getId());
        assertThat(slice.getContent(), hasSize(4));
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public void shouldPaginateWithChangingSeenValues() {
        tx.execute(s -> givenQuery(null, null, null, null, "false", null, 2, user1.getId()));

        assertThat(slice.getContent(), hasItems(
                allOf(hasProperty("id", is(user1SubscriptionEntry4.getId())), hasProperty("seen", is(false))),
                allOf(hasProperty("id", is(user1SubscriptionEntry3.getId())), hasProperty("seen", is(false)))
        ));

        tx.execute(s -> {
            SubscriptionEntry subscriptionEntry = testEntityManager.find(SubscriptionEntry.class, user1SubscriptionEntry4.getId());
            subscriptionEntry.setSeen(true);
            return testEntityManager.persistFlushFind(subscriptionEntry);
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
            SubscriptionEntry subscriptionEntry = testEntityManager.find(SubscriptionEntry.class, user1SubscriptionEntry2.getId());
            subscriptionEntry.setSeen(true);
            return testEntityManager.persistFlushFind(subscriptionEntry);
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
