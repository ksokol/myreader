package myreader.repository;

import myreader.entity.Subscription;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class SubscriptionRepositoryTests extends IntegrationTestSupport {

    private static final long SUBSCRIPTION_ID = 1L;
    private static final long FEED_ENTRY_ID = 1L;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Override
    public void beforeTest() {
        Subscription subscription = subscriptionRepository.findOne(SUBSCRIPTION_ID);
        assertThat(subscription.getLastFeedEntryId(), nullValue());
        assertThat(subscription.getUnseen(), is(1));
        assertThat(subscription.getFetchCount(), is(15));
    }

    @Test
    public void updateLastFeedEntry() throws Exception {
        subscriptionRepository.updateLastFeedEntryId(FEED_ENTRY_ID, SUBSCRIPTION_ID);

        assertThat(subscriptionRepository.findOne(SUBSCRIPTION_ID).getLastFeedEntryId(), is(1L));
    }

    @Test
    public void updateLastFeedEntryIdAndIncrementUnseenAndIncrementFetchCount() throws Exception {
        subscriptionRepository.updateLastFeedEntryIdAndIncrementUnseenAndIncrementFetchCount(FEED_ENTRY_ID, SUBSCRIPTION_ID);

        Subscription after = subscriptionRepository.findOne(SUBSCRIPTION_ID);
        assertThat(after.getLastFeedEntryId(), is(FEED_ENTRY_ID));
        assertThat(after.getUnseen(), is(2));
        assertThat(after.getFetchCount(), is(16));
    }

}