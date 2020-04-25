package myreader.test;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.entity.User;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * @author Kamill Sokol
 */
@Scope("prototype")
@Component
public class TestEntitiesBuilder {

    private final TestEntityManager testEntityManager;

    private User user;
    private Feed feed;
    private FeedEntry feedEntry;
    private Subscription subscription;
    private SubscriptionEntry subscriptionEntry;

    public TestEntitiesBuilder(TestEntityManager testEntityManager) {
        this.testEntityManager = testEntityManager;
    }

    public static TestEntitiesBuilder with(TestEntityManager testEntityManager) {
        return new TestEntitiesBuilder(testEntityManager);
    }

    public TestEntitiesBuilder user(String email) {
        user = new User(email);
        return this;
    }

    public TestEntitiesBuilder someFeed() {
        feed = new Feed("http://example.com", "expected feed title");
        build();
        return this;
    }

    public TestEntitiesBuilder someFeedEntry() {
        feedEntry = new FeedEntry(feed);
        build();
        return this;
    }

    public TestEntitiesBuilder someSubscription() {
        subscription = new Subscription(user, feed);
        build();
        return this;
    }

    public TestEntitiesBuilder someSubscriptionEntry() {
        subscriptionEntry = new SubscriptionEntry(subscription, feedEntry);
        build();
        return this;
    }

    public TestEntitiesBuilder build() {
        if (feed != null) {
            feed = testEntityManager.merge(feed);
            feed = testEntityManager.persistAndFlush(feed);
        }
        if (feedEntry != null) {
            feedEntry = testEntityManager.merge(feedEntry);
            feedEntry = testEntityManager.persistAndFlush(feedEntry);
        }
        if (user != null) {
            user = testEntityManager.merge(user);
            user = testEntityManager.persistFlushFind(user);
        }
        if (subscription != null) {
            subscription = testEntityManager.merge(subscription);
            subscription = testEntityManager.persistFlushFind(subscription);
        }
        if (subscriptionEntry != null) {
            subscriptionEntry = testEntityManager.merge(subscriptionEntry);
            subscriptionEntry = testEntityManager.persistFlushFind(subscriptionEntry);
        }
        return this;
    }
}
