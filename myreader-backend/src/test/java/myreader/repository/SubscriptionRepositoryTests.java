package myreader.repository;

import myreader.entity.Subscription;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@DataJpaTest
@TestPropertySource(properties = { "task.enabled = false" })
@Sql("/test-data.sql")
public class SubscriptionRepositoryTests {

    private static final long SUBSCRIPTION_ID = 1L;
    private static final long FEED_ENTRY_ID = 1L;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private TestEntityManager em;

    private Subscription subscription;

    @Before
    public void before() {
        subscription = em.find(Subscription.class, SUBSCRIPTION_ID);
        assertThat(subscription.getLastFeedEntryId(), nullValue());
        assertThat(subscription.getUnseen(), is(1));
        assertThat(subscription.getFetchCount(), is(15));
    }

    @Test
    public void updateLastFeedEntry() throws Exception {
        subscriptionRepository.updateLastFeedEntryId(FEED_ENTRY_ID, SUBSCRIPTION_ID);

        subscription = em.refresh(subscription);

        assertThat(subscription.getLastFeedEntryId(), is(1L));
    }

    @Test
    public void updateLastFeedEntryIdAndIncrementUnseenAndIncrementFetchCount() throws Exception {
        subscriptionRepository.updateLastFeedEntryIdAndIncrementUnseenAndIncrementFetchCount(FEED_ENTRY_ID, SUBSCRIPTION_ID);

        subscription = em.refresh(subscription);

        assertThat(subscription.getLastFeedEntryId(), is(FEED_ENTRY_ID));
        assertThat(subscription.getUnseen(), is(2));
        assertThat(subscription.getFetchCount(), is(16));
    }

}