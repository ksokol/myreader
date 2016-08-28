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
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;

import javax.persistence.EntityManager;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@DataJpaTest(includeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = IndexSyncJob.class))
@TestPropertySource(properties = { "task.enabled = false" })
@Sql("/test-data.sql")
public class IndexSyncJobTest {

	@Autowired
	private IndexSyncJob indexSyncJob;
	@Autowired
	private SubscriptionEntryRepository subscriptionEntryRepository;
    @Autowired
    private PlatformTransactionManager transactionManager;
    @Autowired
    private ApplicationContext applicationContext;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

	@Test
	public void testReindexAllSubscriptionEntries() {
        int sizeBefore = allSearchEntries().size();

		addSubscriptionEntry();
		addSubscriptionEntry();
		addSubscriptionEntry();

        indexSyncJob.setBatchSize(2);
		indexSyncJob.run();

        int sizeAfter = allSearchEntries().size();

        assertThat(sizeBefore, is(sizeAfter - 3));
	}

    @Test
    public void testCatchedException() {
        final TransactionTemplate mockTransactionalTemplate = mock(TransactionTemplate.class);
        when(mockTransactionalTemplate.execute(any(TransactionCallback.class))).thenThrow(new RuntimeException("junit"));
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

        indexSyncJob.setBatchSize(0);
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

	private List<SubscriptionEntry> allSearchEntries() {
		return subscriptionEntryRepository.findAll();
	}

	private void addSubscriptionEntry() {
		SubscriptionEntry one = subscriptionEntryRepository.findOne(1001L);
		SubscriptionEntry subscriptionEntry = new SubscriptionEntry();
		subscriptionEntry.setFeedEntry(one.getFeedEntry());
		subscriptionEntry.setSubscription(one.getSubscription());
		subscriptionEntryRepository.save(subscriptionEntry);
	}
}
