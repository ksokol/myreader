package myreader.service.search.jobs;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.test.ClearDb;
import myreader.test.TestUser;
import myreader.test.WithTestProperties;
import org.hibernate.search.jpa.Search;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import javax.persistence.EntityManager;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.springframework.context.annotation.FilterType.ASSIGNABLE_TYPE;

@ExtendWith(SpringExtension.class)
@Transactional(propagation = Propagation.SUPPORTS)
@ClearDb
@DataJpaTest(showSql = false, includeFilters = @Filter(type = ASSIGNABLE_TYPE, classes = {IndexSyncJob.class}))
@WithTestProperties
class IndexSyncJobTests {

    @Autowired
    private IndexSyncJob job;

    @Autowired
    private EntityManager em;

    @Autowired
    private TestEntityManager testEntityManager;

    @Autowired
    private TransactionTemplate tx;

    private FeedEntry feedEntry;
    private Subscription subscription;

    @BeforeEach
    void before() {
        tx.execute(status -> {
            var user = testEntityManager.persist(TestUser.USER4.toUser());
            var feed = testEntityManager.persist(new Feed("http://example.com", "expected feed title"));
            feedEntry = testEntityManager.persist(new FeedEntry(feed));
            subscription = testEntityManager.persist(new Subscription(user, feed));
            return null;
        });
    }

    @Test
    void testReindexAllSubscriptionEntries() throws InterruptedException {
        job.work();

        var countBefore = indexedEntryCount();

        addAnSubscriptionEntry();
        addAnSubscriptionEntry();
        addAnSubscriptionEntry();

        job.work();

        assertThat(indexedEntryCount(), is(countBefore + 3));
    }

    private int indexedEntryCount() {
        var fullTextEm = Search.getFullTextEntityManager(em);
        return fullTextEm.getSearchFactory().getStatistics().getNumberOfIndexedEntities(SubscriptionEntry.class.getName());
    }

    private void addAnSubscriptionEntry() {
        tx.execute(s -> testEntityManager.persist(new SubscriptionEntry(subscription, feedEntry)));
    }
}
