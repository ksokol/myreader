package myreader.repository;

import myreader.entity.SubscriptionEntry;
import myreader.test.TestUser;
import myreader.test.WithTestProperties;
import org.hamcrest.Matchers;
import org.hibernate.search.jpa.Search;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Slice;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.Set;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@Sql("classpath:test-data.sql")
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

    @Before
    public void setUp() {
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
    public void shouldFindTagsForGivenUser() {
        Set<String> actualTagsForUser4 = subscriptionEntryRepository.findDistinctTagsByUserId(TestUser.USER4.id);
        assertThat(actualTagsForUser4, contains("tag1", "tag2-tag3", "tag4", "tag5", "tag6", "tag7", "tag8Tag9"));

        Set<String> actualTagsForUser1 = subscriptionEntryRepository.findDistinctTagsByUserId(TestUser.USER1.id);
        assertThat(actualTagsForUser1, contains("tag1"));
    }

    @Test
    public void shouldSearchForGivenUser() {
        givenQuery(null, null, null, null, null, null, 100, TestUser.USER4.id);
        assertThat(slice.getContent(), hasItem(hasProperty("id", is(1013L))));
        assertThat(slice.getContent(), not(hasItem(hasProperty("id", is(1002L)))));

        givenQuery(null, null, null, null, null, null, 100, TestUser.USER1.id);
        assertThat(slice.getContent(), hasItem(hasProperty("id", is(1002L))));
        assertThat(slice.getContent(), not(hasItem(hasProperty("id", is(1013L)))));
    }

    @Test
    public void searchWithPageSizeOne() {
        givenQuery(null, null, null, null, null, null, 1, TestUser.USER4.id);
        assertThat(slice.getContent(), everyItem(hasProperty("id", is(1013L))));
    }

    @Test
    public void searchSubscriptionEntryByTitle() {
        givenQuery("mysql", null, null, null, null, null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), everyItem(hasProperty("id", is(1010L))));
    }

    @Test
    public void searchSubscriptionEntryByContent() {
        givenQuery("cont", null, null, null, null, null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), hasSize(5));
    }

    @Test
    public void searchPaginated() {
        givenQuery("from", null, null, null, null, null, 10, TestUser.USER4.id);
        assertThat(slice.getNumberOfElements(), is(2));

        givenQuery("from", null, null, null, null, null, 1, TestUser.USER4.id);
        assertThat(slice.getContent().get(0).getId(), is(1013L));
        assertThat(slice.hasNext(), is(true));

        givenQuery("from", null, null, null, null, 1013L, 1, TestUser.USER4.id);
        assertThat(slice.getContent().get(0).getId(), is(1012L));
        assertThat(slice.hasNext(), is(false));
    }

    @Test
    public void searchNextPage() {
        givenQuery(null, null, null, null, null, 1582801646000L, 1, TestUser.USER4.id);
        assertThat(slice.getContent(), everyItem(hasProperty("id", is(1013L))));
        assertThat(slice.hasNext(), is(true));
    }

    @Test
    public void searchSubscriptionEntryByTag() {
        givenQuery("tag5", null, null, null, null, null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), contains(hasProperty("id", is(1011L))));
    }

    @Test
    public void searchSubscriptionEntryTag() {
        givenQuery("help", null, null, null, null, null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), contains(hasProperty("id", is(1011L))));
    }

    @Test
    public void seenEqualFalse() {
        givenQuery(null, null, null, null, "false", null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), hasSize(5));
    }

    @Test
    public void seenEqualTrue() {
        givenQuery(null, null, null, null, "true", null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), hasSize(0));
    }

    @Test
    public void seenEqualWildcard() {
        givenQuery(null, null, null, null, "*", null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), hasSize(5));
    }

    @Test
    public void feedUuidEqual14() {
        givenQuery(null, "14", null, null, null, null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), hasSize(4));
    }

    @Test
    public void feedUuidEqual9114() {
        givenQuery(null, "9114", null, null, null, null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), hasSize(0));
    }

    @Test
    public void feedTagEqualUnknown() {
        givenQuery(null, null, "unknown", null, null, null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), hasSize(0));
    }

    @Test
    public void feedTagEqualTag1() {
        givenQuery(null, null, "tag1", null, null, null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), everyItem(hasProperty("id", is(1013L))));
    }

    @Test
    public void entryTagEqualTag2Tag3() {
        givenQuery(null, null, null, "tag2", null, null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), hasSize(0));

        givenQuery(null, null, null, "tag2-tag3", null, null, 10, TestUser.USER4.id);
        assertThat(slice.getContent().get(0).getId(), is(1010L));
        assertThat(slice.getContent().get(0).getTag(), is("tag2-tag3"));
    }

    @Test
    public void entryTagEqualTag4AndTag5() {
        givenQuery(null, null, null, "tag4", null, null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), hasSize(1));
        assertThat(slice.getContent().get(0).getId(), is(1011L));
        assertThat(slice.getContent().get(0).getTag(), is("tag4 tag5"));

        givenQuery(null, null, null, "tag5", null, null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), hasSize(1));
        assertThat(slice.getContent().get(0).getId(), is(1011L));
        assertThat(slice.getContent().get(0).getTag(), is("tag4 tag5"));
    }

    @Test
    public void entryTagEqualTag6AndTag7() {
        givenQuery(null, null, null, "tag6", null, null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), hasSize(1));
        assertThat(slice.getContent().get(0).getId(), is(1012L));
        assertThat(slice.getContent().get(0).getTag(), is("tag6,tag7"));

        givenQuery(null, null, null, "tag7", null, null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), hasSize(1));
        assertThat(slice.getContent().get(0).getId(), is(1012L));
        assertThat(slice.getContent().get(0).getTag(), is("tag6,tag7"));
    }

    @Test
    public void entryTagEqualTag8Tag9() {
        givenQuery(null, null, null, "tag8tag9", null, null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), hasSize(0));

        givenQuery(null, null, null, "tag8Tag9", null, null, 10, TestUser.USER4.id);
        assertThat(slice.getContent().get(0).getId(), is(1013L));
        assertThat(slice.getContent().get(0).getTag(), is("tag8Tag9"));
    }

    @Test
    public void shouldAppendAsteriskToSearchParameterWhenSearchParameterDoesNotEndWithAsterisk() {
        givenQuery("con", null, null, null, "*", null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), hasSize(5));

        givenQuery("con*", null, null, null, "*", null, 10, TestUser.USER4.id);
        assertThat(slice.getContent(), hasSize(5));
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public void shouldPaginateWithChangingSeenValues() {
        tx.execute(s -> givenQuery(null, null, null, null, "false", null, 2, TestUser.USER4.id));

        assertThat(slice.getContent(), hasItems(
                allOf(hasProperty("id", is(1013L)), hasProperty("seen", is(false))),
                allOf(hasProperty("id", is(1012L)), hasProperty("seen", is(false)))
        ));

        tx.execute(s -> {
            SubscriptionEntry subscriptionEntry = testEntityManager.find(SubscriptionEntry.class, 1012L);
            subscriptionEntry.setSeen(true);
            return testEntityManager.persistFlushFind(subscriptionEntry);
        });

        tx.execute(s -> givenQuery(null, null, null, null, null, null, 10, TestUser.USER4.id));
        assertThat(slice.getContent(), hasItems(
                allOf(Matchers.<SubscriptionEntry>hasProperty("id", is(1013L)), hasProperty("seen", is(false))),
                allOf(hasProperty("id", is(1012L)), hasProperty("seen", is(true))),
                allOf(hasProperty("id", is(1011L)), hasProperty("seen", is(false))),
                allOf(hasProperty("id", is(1010L)), hasProperty("seen", is(false))),
                allOf(hasProperty("id", is(1009L)), hasProperty("seen", is(false)))
        ));

        tx.execute(s -> givenQuery(null, null, null, null, "false", 1012L, 2, TestUser.USER4.id));
        assertThat(slice.getContent(), contains(hasProperty("id", is(1011L)), hasProperty("id", is(1010L))));

        tx.execute(s -> {
            SubscriptionEntry subscriptionEntry = testEntityManager.find(SubscriptionEntry.class, 1010L);
            subscriptionEntry.setSeen(true);
            return testEntityManager.persistFlushFind(subscriptionEntry);
        });

        tx.execute(s -> givenQuery(null, null, null, null, null, null, 10, TestUser.USER4.id));
        assertThat(slice.getContent(), hasItems(
                allOf(Matchers.<SubscriptionEntry>hasProperty("id", is(1013L)), hasProperty("seen", is(false))),
                allOf(hasProperty("id", is(1012L)), hasProperty("seen", is(true))),
                allOf(hasProperty("id", is(1011L)), hasProperty("seen", is(false))),
                allOf(hasProperty("id", is(1010L)), hasProperty("seen", is(true))),
                allOf(hasProperty("id", is(1009L)), hasProperty("seen", is(false)))
        ));

        tx.execute(s -> givenQuery(null, null, null, null, "false", 1010L, 2, TestUser.USER4.id));
        assertThat(slice.getContent(), contains(hasProperty("id", is(1009L))));
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
