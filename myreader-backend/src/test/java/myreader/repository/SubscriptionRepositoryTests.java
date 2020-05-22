package myreader.repository;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.test.WithTestProperties;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Optional;

import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@DataJpaTest(showSql = false)
@Sql("classpath:test-data.sql")
@WithTestProperties
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
        assertThat(subscription.getFetchCount(), is(15));
    }

    @Test
    public void updateLastFeedEntry() {
        subscriptionRepository.updateLastFeedEntryId(FEED_ENTRY_ID, SUBSCRIPTION_ID);

        subscription = em.refresh(subscription);

        assertThat(subscription.getLastFeedEntryId(), is(1L));
    }

    @Test
    public void updateLastFeedEntryIdAndIncrementFetchCount() {
        subscriptionRepository.updateLastFeedEntryIdAndIncrementFetchCount(FEED_ENTRY_ID, SUBSCRIPTION_ID);

        subscription = em.refresh(subscription);

        assertThat(subscription.getLastFeedEntryId(), is(FEED_ENTRY_ID));
        assertThat(subscription.getFetchCount(), is(16));
    }

    @Test
    public void shouldReturnZeroWhenCountingOverUnknownFeedId() {
        assertThat(subscriptionRepository.countByFeedId(999L), is(0));
    }

    @Test
    public void shouldReturnOneWhenCountingOverFeedWithSubscription() {
        User user = new User("email");
        em.persist(user);

        Feed feed = em.persist(new Feed("http://url1", "feed1"));

        Subscription subscription = new Subscription(user, feed);
        em.persist(subscription);

        assertThat(subscriptionRepository.countByFeedId(feed.getId()), is(1));
    }

    @Test
    public void shouldRecalculateSubscriptionUnseenCount() {
        subscription = em.find(Subscription.class, 3L);
        assertThat(subscription.getUnseen(), is(1));

        subscription.getSubscriptionEntries().forEach(subscriptionEntry -> subscriptionEntry.setSeen(false));
        em.flush();

        subscription = em.refresh(subscription);
        assertThat(subscription.getUnseen(), is(2));
    }

    @Test
    public void shouldFindByIdAndUserIdForUser1() {
        Subscription subscription = subscriptionRepository
                .findByIdAndUserId(1L, 1)
                .orElseThrow(AssertionError::new);

        assertThat(subscription, hasProperty("title", is("user1_subscription1")));
    }

    @Test
    public void shouldFindByIdAndUserIdForUser2() {
        Subscription subscriptionTag = subscriptionRepository
                .findByIdAndUserId(6L, 2L)
                .orElseThrow(AssertionError::new);

        assertThat(subscriptionTag, hasProperty("title", is("user2_subscription1")));
    }

    @Test
    public void shouldNotFindByIdAndUserIdForUser2() {
        Optional<Subscription> subscription = subscriptionRepository
                .findByIdAndUserId(1L, 2L);

        assertThat(subscription.isPresent(), is(false));
    }
}
