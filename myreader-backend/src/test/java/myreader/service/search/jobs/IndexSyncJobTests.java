package myreader.service.search.jobs;

import myreader.entity.SubscriptionEntry;
import myreader.test.TestEntitiesBuilder;
import myreader.test.TestProperties;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.Search;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.Import;
import org.springframework.security.data.repository.query.SecurityEvaluationContextExtension;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
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
@Import({IndexSyncJobTests.TestConfiguration.class})
@DataJpaTest(showSql = false, includeFilters = @Filter(type = ASSIGNABLE_TYPE, classes = {IndexSyncJob.class, TestEntitiesBuilder.class}))
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

    @DynamicPropertySource
    static void withProperties(DynamicPropertyRegistry registry) {
        TestProperties.withProperties(registry);
        registry.add("spring.jpa.properties.hibernate.search.indexing_strategy", () -> "manual");
    }

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

    static class TestConfiguration {

        @Bean
        public SecurityEvaluationContextExtension securityEvaluationContextExtension() {
            return new SecurityEvaluationContextExtension();
        }
    }
}
