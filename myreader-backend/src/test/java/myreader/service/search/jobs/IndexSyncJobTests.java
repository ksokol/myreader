package myreader.service.search.jobs;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.entity.User;
import myreader.test.TestUser;
import myreader.test.WithTestProperties;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.Search;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import javax.persistence.EntityManager;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.springframework.context.annotation.FilterType.ASSIGNABLE_TYPE;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@Transactional(propagation = Propagation.SUPPORTS)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@DataJpaTest(showSql = false, includeFilters = @Filter(type = ASSIGNABLE_TYPE, classes = {IndexSyncJob.class}))
@WithTestProperties
public class IndexSyncJobTests {

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

    @Before
    public void before() {
        tx.execute(s -> {
                    User user = testEntityManager.persistFlushFind(new User(TestUser.USER4.email));
                    Feed feed = testEntityManager.persistFlushFind(new Feed("http://example.com", "expected feed title"));
                    feedEntry = testEntityManager.persistFlushFind(new FeedEntry(feed));
                    subscription = testEntityManager.persistFlushFind(new Subscription(user, feed));
                    return null;
                }
        );
    }

    @Test
    public void testReindexAllSubscriptionEntries() throws InterruptedException {
        job.work();

        int countBefore = indexedEntryCount();

        addAnSubscriptionEntry();
        addAnSubscriptionEntry();
        addAnSubscriptionEntry();

        job.work();

        assertThat(indexedEntryCount(), is(countBefore + 3));
    }

    private int indexedEntryCount() {
        FullTextEntityManager fullTextEm = Search.getFullTextEntityManager(em);
        return fullTextEm.getSearchFactory().getStatistics().getNumberOfIndexedEntities(SubscriptionEntry.class.getName());
    }

    private void addAnSubscriptionEntry() {
        tx.execute(s -> testEntityManager.persist(new SubscriptionEntry(subscription, feedEntry)));
    }
}
