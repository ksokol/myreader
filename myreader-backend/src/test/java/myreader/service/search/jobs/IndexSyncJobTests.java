package myreader.service.search.jobs;

import myreader.entity.SubscriptionEntry;
import myreader.test.TestEntitiesBuilder;
import myreader.test.WithTestProperties;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.Search;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.security.test.context.support.WithMockUser;
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
@DataJpaTest(showSql = false, includeFilters = @Filter(type = ASSIGNABLE_TYPE, classes = {IndexSyncJob.class, TestEntitiesBuilder.class}))
@WithTestProperties
public class IndexSyncJobTests {

    private static final String USER = "user1@localhost";

    @Autowired
    private IndexSyncJob job;

    @Autowired
    private TestEntitiesBuilder testEntitiesBuilder;

    @Autowired
    private EntityManager em;

    @Autowired
    private TransactionTemplate tx;

    @Before
    public void before() {
        tx.execute(s ->
            testEntitiesBuilder
                    .user(USER).build()
                    .someFeed()
                    .someFeedEntry()
                    .someSubscription()
        );
    }

    @WithMockUser(USER)
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
        tx.execute(s -> testEntitiesBuilder.someSubscriptionEntry());
    }
}
