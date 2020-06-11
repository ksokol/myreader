package myreader.repository;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.entity.User;
import myreader.test.WithTestProperties;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.emptyIterable;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@DataJpaTest(showSql = false)
@WithTestProperties
public class SubscriptionRepositoryTests {

    private static final long FEED_ENTRY_ID = 1L;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private TestEntityManager testEntityManager;

    private User user;
    private Feed feed;
    private Subscription subscription1;
    private Subscription subscription2;

    @Before
    public void before() {
        user = testEntityManager.persistFlushFind(new User("example@localhost"));
        feed = testEntityManager.persistFlushFind(new Feed("http://example1.com", "expected feed title1"));
        Feed feed2 = testEntityManager.persistFlushFind(new Feed("http://example2.com", "expected feed title2"));

        subscription1 = new Subscription(user, feed);
        subscription1.setTitle("expected title1");
        subscription1 = testEntityManager.persistFlushFind(subscription1);

        subscription2 = new Subscription(user, feed2);
        subscription2.setTitle("expected title2");
        subscription2 = testEntityManager.persistFlushFind(subscription2);

        FeedEntry fe1 = testEntityManager.persistFlushFind(new FeedEntry(subscription1.getFeed()));
        FeedEntry fe2 = testEntityManager.persistFlushFind(new FeedEntry(subscription1.getFeed()));

        SubscriptionEntry subscriptionEntry1 = new SubscriptionEntry(subscription1, fe1);
        SubscriptionEntry subscriptionEntry2 = new SubscriptionEntry(subscription1, fe2);

        subscriptionEntry1.setSeen(false);
        subscriptionEntry2.setSeen(false);

        testEntityManager.persistAndFlush(subscriptionEntry1);
        testEntityManager.persistAndFlush(subscriptionEntry2);
        subscription1 = testEntityManager.refresh(subscription1);
    }

    @Test
    public void updateLastFeedEntry() {
        subscriptionRepository.updateLastFeedEntryId(FEED_ENTRY_ID, subscription1.getId());
        testEntityManager.clear();

        assertThat(
                testEntityManager.find(Subscription.class, subscription1.getId()),
                hasProperty("lastFeedEntryId", is(FEED_ENTRY_ID))
        );
    }

    @Test
    public void updateLastFeedEntryIdAndIncrementFetchCount() {
        subscriptionRepository.updateLastFeedEntryIdAndIncrementFetchCount(FEED_ENTRY_ID, subscription1.getId());
        testEntityManager.clear();

        Subscription actual  = testEntityManager.find(Subscription.class, subscription1.getId());

        assertThat(actual, hasProperty("lastFeedEntryId", is(FEED_ENTRY_ID)));
        assertThat(actual, hasProperty("fetchCount", is(1)));
    }

    @Test
    public void shouldReturnZeroWhenCountingByUnknownFeedId() {
        assertThat(subscriptionRepository.countByFeedId(999L), is(0));
    }

    @Test
    public void shouldReturnOneWhenCountingByFeedWithSubscription() {
        User user = testEntityManager.persistFlushFind(new User("email"));
        Feed feed = testEntityManager.persistFlushFind(new Feed("http://url1", "feed1"));
        testEntityManager.persistAndFlush(new Subscription(user, feed));

        assertThat(subscriptionRepository.countByFeedId(feed.getId()), is(1));
    }

    @Test
    public void shouldRecalculateSubscriptionUnseenCount() {
        assertThat(subscription1.getUnseen(), is(2));
    }

    @Test
    public void shouldFindByIdAndUserIdForUser1() {
        Subscription actual = subscriptionRepository
                .findByIdAndUserId(subscription1.getId(), user.getId())
                .orElseThrow(AssertionError::new);

        assertThat(actual, hasProperty("title", is("expected title1")));
    }

    @Test
    public void shouldFindByIdAndUserIdForUser2() {
        User user2 = testEntityManager.persistFlushFind(new User("example2@localhost"));
        Subscription subscription2 = new Subscription(user2, feed);
        subscription2.setTitle("expected title2");
        subscription2 = testEntityManager.persistFlushFind(subscription2);

        Subscription subscription = subscriptionRepository
                .findByIdAndUserId(subscription2.getId(), user2.getId())
                .orElseThrow(AssertionError::new);

        assertThat(subscription, hasProperty("title", is("expected title2")));
    }

    @Test
    public void shouldNotFindByIdAndUserIdForUser2() {
        User user2 = testEntityManager.persistFlushFind(new User("example2@localhost"));
        Optional<Subscription> actual = subscriptionRepository
                .findByIdAndUserId(subscription1.getId(), user2.getId());

        assertThat(actual.isPresent(), is(false));
    }

    @Test
    public void shouldFindAllByNegativeUnseenCount() {
        List<Subscription> actual = subscriptionRepository.findAllByUnseenGreaterThanAndUserId(-1, user.getId());

        assertThat(actual, hasItems(
                allOf(
                        hasProperty("id", is(subscription1.getId())),
                        hasProperty("unseen", is(subscription1.getUnseen()))
                ),
                allOf(
                        hasProperty("id", is(subscription2.getId())),
                        hasProperty("unseen", is(subscription2.getUnseen()))
                )
        ));
    }

    @Test
    public void shouldNotFindAnyByNegativeUnseenCountAndUnknownUserId() {
        List<Subscription> actual = subscriptionRepository.findAllByUnseenGreaterThanAndUserId(-1, 999L);

        assertThat(actual, emptyIterable());
    }

    @Test
    public void shouldFindAllByPositiveUnseenCount() {
        List<Subscription> actual = subscriptionRepository.findAllByUnseenGreaterThanAndUserId(1, user.getId());

        assertThat(actual, hasItems(
                allOf(
                        hasProperty("id", is(subscription1.getId())),
                        hasProperty("unseen", is(subscription1.getUnseen()))
                )
        ));
    }

    @Test
    public void shouldNotFindByUnknownFeedUrl() {
        Optional<Subscription> actual = subscriptionRepository.findByFeedUrlAndUserId("unknown", user.getId());

        assertThat(actual.isPresent(), is(false));
    }

    @Test
    public void shouldNotFindByFeedUrlAndUnknownUserId() {
        Optional<Subscription> actual = subscriptionRepository.findByFeedUrlAndUserId(feed.getUrl(), 999L);

        assertThat(actual.isPresent(), is(false));
    }

    @Test
    public void shouldindByFeedUrl() {
        Subscription actual = subscriptionRepository.findByFeedUrlAndUserId(feed.getUrl(), user.getId())
                .orElseThrow(AssertionError::new);

        assertThat(actual, hasProperty("id", is(subscription1.getId())));
    }
}
