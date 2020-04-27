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

    private User userEntity;
    private Feed feedEntity;
    private FeedEntry feedEntryEntity;
    private Subscription subscriptionEntity;
    private SubscriptionEntry subscriptionEntryEntity;

    public TestEntitiesBuilder(TestEntityManager testEntityManager) {
        this.testEntityManager = testEntityManager;
    }

    public static TestEntitiesBuilder with(TestEntityManager testEntityManager) {
        return new TestEntitiesBuilder(testEntityManager);
    }

    public TestEntitiesBuilder user(String email) {
        userEntity = new User(email);
        return this;
    }

    public TestEntitiesBuilder someFeed() {
        feedEntity = new Feed("http://example.com", "expected feed title");
        build();
        return this;
    }

    public TestEntitiesBuilder someFeedEntry() {
        feedEntryEntity = new FeedEntry(feedEntity);
        build();
        return this;
    }

    public TestEntitiesBuilder someSubscription() {
        subscriptionEntity = new Subscription(userEntity, feedEntity);
        build();
        return this;
    }

    public TestEntitiesBuilder someSubscriptionEntry() {
        subscriptionEntryEntity = new SubscriptionEntry(subscriptionEntity, feedEntryEntity);
        build();
        return this;
    }

    public TestEntitiesBuilder build() {
        if (feedEntity != null) {
            feedEntity = testEntityManager.merge(feedEntity);
            feedEntity = testEntityManager.persistAndFlush(feedEntity);
        }
        if (feedEntryEntity != null) {
            feedEntryEntity = testEntityManager.merge(feedEntryEntity);
            feedEntryEntity = testEntityManager.persistAndFlush(feedEntryEntity);
        }
        if (userEntity != null) {
            userEntity = testEntityManager.merge(userEntity);
            userEntity = testEntityManager.persistFlushFind(userEntity);
        }
        if (subscriptionEntity != null) {
            subscriptionEntity = testEntityManager.merge(subscriptionEntity);
            subscriptionEntity = testEntityManager.persistFlushFind(subscriptionEntity);
        }
        if (subscriptionEntryEntity != null) {
            subscriptionEntryEntity = testEntityManager.merge(subscriptionEntryEntity);
            subscriptionEntryEntity = testEntityManager.persistFlushFind(subscriptionEntryEntity);
        }
        return this;
    }
}
