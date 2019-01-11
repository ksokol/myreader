package myreader.service.search.jobs;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import org.hibernate.Criteria;
import org.hibernate.ScrollMode;
import org.hibernate.ScrollableResults;
import org.hibernate.search.FullTextSession;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import javax.persistence.EntityManager;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.context.annotation.FilterType.ASSIGNABLE_TYPE;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@DataJpaTest(includeFilters = @Filter(type = ASSIGNABLE_TYPE, classes = IndexSyncJob.class))
@TestPropertySource(properties = { "task.enabled = false" })
@Sql("classpath:test-data.sql")
public class IndexSyncJobTests {

    @Autowired
    private IndexSyncJob job;

    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;

    @Autowired
    private PlatformTransactionManager transactionManager;

    @Autowired
    private ApplicationContext applicationContext;

    @Autowired
    private TestEntityManager em;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Test
    public void testReindexAllSubscriptionEntries() {
        int sizeBefore = subscriptionEntryRepository.findAll().size();
        addSubscriptionEntry();
        addSubscriptionEntry();
        addSubscriptionEntry();

        job.setBatchSize(100);
        job.run();

        int sizeAfter = subscriptionEntryRepository.findAll().size();

        assertThat(sizeBefore, is(sizeAfter - 3));
    }

    @Test
    public void testExceptionHandling() {
        final TransactionTemplate mockTransactionalTemplate = mock(TransactionTemplate.class);
        when(mockTransactionalTemplate.execute(any())).thenThrow(new RuntimeException("junit"));
        final IndexSyncJob indexSyncJob = new IndexSyncJob(null, mockTransactionalTemplate);

        try {
            indexSyncJob.run();
        } catch(Exception e) {
            fail("exception not caught inside " + IndexSyncJob.class.getName());
        }
    }

    @Test
    public void testSetBatchSize() {
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage("batchSize less than 1");

        job.setBatchSize(0);
    }

    @Test
    public void testAliveIsFalse() {
        final EntityManager spyEm = mock(EntityManager.class);
        final FullTextSession mockFullTextSession = mock(FullTextSession.class);
        when(spyEm.getDelegate()).thenReturn(mockFullTextSession);

        final Criteria mockCriteria = mock(Criteria.class);

        when(mockFullTextSession.createCriteria(SubscriptionEntry.class)).thenReturn(mockCriteria);
        when(mockCriteria.setFetchSize(anyInt())).thenReturn(mockCriteria);

        final ScrollableResults mockScrollableResults = mock(ScrollableResults.class);
        when(mockCriteria.scroll(ScrollMode.FORWARD_ONLY)).thenReturn(mockScrollableResults);
        when(mockScrollableResults.next()).thenReturn(true, false);

        final IndexSyncJob uut = new IndexSyncJob(spyEm, new TransactionTemplate(transactionManager));
        uut.onApplicationEvent(new ContextClosedEvent(applicationContext));

        addSubscriptionEntry();
        uut.run();

        verify(mockScrollableResults, never()).get(anyInt());
    }

    private void addSubscriptionEntry() {
        SubscriptionEntry one = subscriptionEntryRepository.findById(1001L).orElseThrow(AssertionError::new);
        SubscriptionEntry subscriptionEntry = new SubscriptionEntry();
        subscriptionEntry.setFeedEntry(one.getFeedEntry());
        subscriptionEntry.setSubscription(one.getSubscription());
        em.persist(subscriptionEntry);
        em.flush();
    }
}
