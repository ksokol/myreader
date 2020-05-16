package myreader.fetcher;

import myreader.entity.ExclusionPattern;
import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.service.time.TimeService;
import myreader.test.WithTestProperties;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.FilterType;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@DataJpaTest(showSql = false, includeFilters = @Filter(type = FilterType.ASSIGNABLE_TYPE, classes = SubscriptionEntryBatch.class))
@Sql("classpath:test-data.sql")
@WithTestProperties
public class SubscriptionEntryBatchTests {

    @Autowired
    private SubscriptionEntryBatch subscriptionEntryBatch;

    @Autowired
    private TestEntityManager testEntityManager;

    @MockBean
    private TimeService timeService;

    @Test
    public void shouldUpdateSubscriptionStatus() {
        Subscription subscription = testEntityManager.find(Subscription.class, 101L);
        assertThat(subscription.getUnseen(), is(0));
        assertThat(subscription.getFetchCount(), is(15));

        FeedEntry feedEntry =  createFeedEntry(subscription.getFeed());

        subscriptionEntryBatch.updateUserSubscriptionEntries();

        subscription = testEntityManager.refresh(subscription);

        assertThat(subscription.getUnseen(), is(1));
        assertThat(subscription.getFetchCount(), is(16));
        assertThat(subscription.getLastFeedEntryId(), is(feedEntry.getId()));
    }

    @Test
    public void shouldUpdateSubscriptionEntries() {
        Subscription subscription = testEntityManager.find(Subscription.class, 101L);
        assertThat(subscription.getSubscriptionEntries(), hasSize(0));

        createFeedEntry(subscription.getFeed());

        subscriptionEntryBatch.updateUserSubscriptionEntries();

        subscription = testEntityManager.refresh(subscription);

        assertThat(subscription.getSubscriptionEntries(), hasSize(1));
    }

    @Test
    public void shouldNotUpdateSubscriptionExclusions() {
        Subscription subscription = testEntityManager.find(Subscription.class, 101L);
        createFeedEntry(subscription.getFeed());

        ExclusionPattern exclusionPattern = new ExclusionPattern();
        exclusionPattern.setSubscription(subscription);
        exclusionPattern.setPattern("irrelevant");

        exclusionPattern = testEntityManager.persist(exclusionPattern);

        subscriptionEntryBatch.updateUserSubscriptionEntries();

        exclusionPattern = testEntityManager.refresh(exclusionPattern);

        assertThat(exclusionPattern.getHitCount(), is(0));
    }

    @Test
    public void shouldNotUpdateSubscriptionStatus() {
        Subscription subscription = testEntityManager.find(Subscription.class, 6L);
        assertThat(subscription.getUnseen(), is(0));
        assertThat(subscription.getFetchCount(), is(15));
        assertThat(subscription.getLastFeedEntryId(), nullValue());

        FeedEntry feedEntry = createFeedEntry(subscription.getFeed());

        subscriptionEntryBatch.updateUserSubscriptionEntries();

        subscription = testEntityManager.refresh(subscription);

        assertThat(subscription.getUnseen(), is(0));
        assertThat(subscription.getFetchCount(), is(15));
        assertThat(subscription.getLastFeedEntryId(), is(feedEntry.getId()));
    }

    @Test
    public void shouldNotUpdateSubscriptionEntries() {
        Subscription subscription = testEntityManager.find(Subscription.class, 6L);
        assertThat(subscription.getSubscriptionEntries(), hasSize(0));

        createFeedEntry(subscription.getFeed());

        subscriptionEntryBatch.updateUserSubscriptionEntries();

        subscription = testEntityManager.refresh(subscription);

        assertThat(subscription.getSubscriptionEntries(), hasSize(0));
    }

    @Test
    public void shouldUpdateSubscriptionExclusions() {
        Subscription subscription = testEntityManager.find(Subscription.class, 6L);
        ExclusionPattern exclusionPattern = subscription.getExclusions().iterator().next();
        assertThat(exclusionPattern.getHitCount(), is(1));

        createFeedEntry(subscription.getFeed());

        subscriptionEntryBatch.updateUserSubscriptionEntries();

        exclusionPattern = testEntityManager.refresh(exclusionPattern);

        assertThat(exclusionPattern.getHitCount(), is(2));
    }

    private FeedEntry createFeedEntry(Feed beforeFeed) {
        FeedEntry feedEntry = new FeedEntry(beforeFeed);
        feedEntry.setTitle("user2_subscription1_pattern1");
        feedEntry.setUrl("url");
        feedEntry.setContent("content");
        feedEntry.setGuid("guid");

        feedEntry = testEntityManager.persist(feedEntry);
        return feedEntry;
    }
}
