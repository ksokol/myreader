package myreader.repository;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.entity.User;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Date;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.emptyIterable;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;

@ExtendWith(SpringExtension.class)
@DataJpaTest(showSql = false)
@WithTestProperties
class SubscriptionRepositoryTests {

    private static final long FEED_ENTRY_ID = 1L;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private TestEntityManager testEntityManager;

    private User user;
    private Feed feed;
    private Subscription subscription1;
    private Subscription subscription2;

    @BeforeEach
    public void before() {
        user = testEntityManager.persistFlushFind(new User("example@localhost"));
        feed = testEntityManager.persistFlushFind(new Feed("http://example1.com", "expected feed title1"));
        var feed2 = testEntityManager.persistFlushFind(new Feed("http://example2.com", "expected feed title2"));

        subscription1 = new Subscription(user, feed);
        subscription1.setTitle("expected title1");
        subscription1.setCreatedAt(new Date(1000));
        subscription1 = testEntityManager.persistFlushFind(subscription1);

        subscription2 = new Subscription(user, feed2);
        subscription2.setTitle("expected title2");
        subscription2.setCreatedAt(new Date(2000));
        subscription2 = testEntityManager.persistFlushFind(subscription2);

        var fe1 = testEntityManager.persistFlushFind(new FeedEntry(subscription1.getFeed()));
        var fe2 = testEntityManager.persistFlushFind(new FeedEntry(subscription1.getFeed()));

        var subscriptionEntry1 = new SubscriptionEntry(subscription1, fe1);
        var subscriptionEntry2 = new SubscriptionEntry(subscription1, fe2);

        subscriptionEntry1.setSeen(false);
        subscriptionEntry2.setSeen(false);

        testEntityManager.persistAndFlush(subscriptionEntry1);
        testEntityManager.persistAndFlush(subscriptionEntry2);
        subscription1 = testEntityManager.refresh(subscription1);
    }

    @Test
    void updateLastFeedEntry() {
        subscriptionRepository.updateLastFeedEntryId(FEED_ENTRY_ID, subscription1.getId());
        testEntityManager.clear();

        assertThat(
                testEntityManager.find(Subscription.class, subscription1.getId()),
                hasProperty("lastFeedEntryId", is(FEED_ENTRY_ID))
        );
    }

    @Test
    void updateLastFeedEntryIdAndIncrementFetchCount() {
        subscriptionRepository.updateLastFeedEntryIdAndIncrementFetchCount(FEED_ENTRY_ID, subscription1.getId());
        testEntityManager.clear();

        var actual  = testEntityManager.find(Subscription.class, subscription1.getId());

        assertThat(actual, hasProperty("lastFeedEntryId", is(FEED_ENTRY_ID)));
        assertThat(actual, hasProperty("fetchCount", is(1)));
    }

    @Test
    void shouldReturnZeroWhenCountingByUnknownFeedId() {
        assertThat(subscriptionRepository.countByFeedId(999L), is(0));
    }

    @Test
    void shouldReturnOneWhenCountingByFeedWithSubscription() {
        var user = testEntityManager.persistFlushFind(new User("email"));
        var feed = testEntityManager.persistFlushFind(new Feed("http://url1", "feed1"));
        testEntityManager.persistAndFlush(new Subscription(user, feed));

        assertThat(subscriptionRepository.countByFeedId(feed.getId()), is(1));
    }

    @Test
    void shouldRecalculateSubscriptionUnseenCount() {
        assertThat(subscription1.getUnseen(), is(2));
    }

    @Test
    void shouldFindByIdAndUserIdForUser1() {
        var actual = subscriptionRepository
                .findByIdAndUserId(subscription1.getId(), user.getId())
                .orElseThrow(AssertionError::new);

        assertThat(actual, hasProperty("title", is("expected title1")));
    }

    @Test
    void shouldFindByIdAndUserIdForUser2() {
        var user2 = testEntityManager.persistFlushFind(new User("example2@localhost"));
        var subscription2 = new Subscription(user2, feed);
        subscription2.setTitle("expected title2");
        subscription2 = testEntityManager.persistFlushFind(subscription2);

        var subscription = subscriptionRepository
                .findByIdAndUserId(subscription2.getId(), user2.getId())
                .orElseThrow(AssertionError::new);

        assertThat(subscription, hasProperty("title", is("expected title2")));
    }

    @Test
    void shouldNotFindByIdAndUserIdForUser2() {
        var user2 = testEntityManager.persistFlushFind(new User("example2@localhost"));
        var actual = subscriptionRepository
                .findByIdAndUserId(subscription1.getId(), user2.getId());

        assertThat(actual.isPresent(), is(false));
    }

    @Test
    void shouldFindAllByNegativeUnseenCount() {
        var actual = subscriptionRepository.findAllByUnseenGreaterThanAndUserId(-1, user.getId());

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
    void shouldNotFindAnyByNegativeUnseenCountAndUnknownUserId() {
        var actual = subscriptionRepository.findAllByUnseenGreaterThanAndUserId(-1, 999L);

        assertThat(actual, emptyIterable());
    }

    @Test
    void shouldFindAllByPositiveUnseenCount() {
        var actual = subscriptionRepository.findAllByUnseenGreaterThanAndUserId(1, user.getId());

        assertThat(actual, hasItems(
                allOf(
                        hasProperty("id", is(subscription1.getId())),
                        hasProperty("unseen", is(subscription1.getUnseen()))
                )
        ));
    }

    @Test
    void shouldNotFindByUnknownFeedUrl() {
        var actual = subscriptionRepository.findByFeedUrlAndUserId("unknown", user.getId());

        assertThat(actual.isPresent(), is(false));
    }

    @Test
    void shouldNotFindByFeedUrlAndUnknownUserId() {
        var actual = subscriptionRepository.findByFeedUrlAndUserId(feed.getUrl(), 999L);

        assertThat(actual.isPresent(), is(false));
    }

    @Test
    void shouldindByFeedUrl() {
        var actual = subscriptionRepository.findByFeedUrlAndUserId(feed.getUrl(), user.getId())
                .orElseThrow(AssertionError::new);

        assertThat(actual, hasProperty("id", is(subscription1.getId())));
    }

    @Test
    void shouldOrderByCreatedAtDescending() {
        var actual = subscriptionRepository.findAllByUnseenGreaterThanAndUserId(-1, user.getId());

        assertThat(actual, contains(
                hasProperty("id", is(subscription2.getId())),
                hasProperty("id", is(subscription1.getId()))
        ));
    }
}
