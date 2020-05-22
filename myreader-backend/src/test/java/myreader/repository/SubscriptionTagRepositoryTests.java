package myreader.repository;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionTag;
import myreader.entity.User;
import myreader.test.WithTestProperties;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@DataJpaTest(showSql = false)
@WithTestProperties
public class SubscriptionTagRepositoryTests {

    @Autowired
    private SubscriptionTagRepository subscriptionTagRepository;

    @Autowired
    private TestEntityManager testEntityManager;

    private User user1;
    private User user2;

    @Before
    public void setUp() {
        user1 = testEntityManager.persistFlushFind(new User("irrelevant"));
        user2 = testEntityManager.persistFlushFind(new User("irrelevant"));

        Feed feed1 = testEntityManager.persistFlushFind(new Feed("irrelevant", "irrelevant"));
        Feed feed2 = testEntityManager.persistFlushFind(new Feed("irrelevant", "irrelevant"));

        Subscription subscription1 = testEntityManager.persistFlushFind(new Subscription(user1, feed1));
        Subscription subscription2 = testEntityManager.persistFlushFind(new Subscription(user1, feed2));
        Subscription subscription3 = testEntityManager.persistFlushFind(new Subscription(user2, feed1));

        SubscriptionTag subscriptionTag1 = new SubscriptionTag("b-tag", user1);
        subscriptionTag1.setColor("#111111");
        subscriptionTag1.setSubscriptions(Collections.singleton(subscription1));
        testEntityManager.persistAndFlush(subscriptionTag1);

        SubscriptionTag subscriptionTag2 = new SubscriptionTag("a-tag", user1);
        subscriptionTag2.setColor("#222222");
        subscriptionTag2.setSubscriptions(Collections.singleton(subscription2));
        testEntityManager.persistAndFlush(subscriptionTag2);

        SubscriptionTag subscriptionTag3 = new SubscriptionTag("tag3", user2);
        subscriptionTag3.setColor("#333333");
        subscriptionTag3.setSubscriptions(Collections.singleton(subscription3));
        testEntityManager.persistAndFlush(subscriptionTag3);
    }

    @Test
    public void findAllByUserOne() {
        List<SubscriptionTag> actual = subscriptionTagRepository.findAllByUserId(user1.getId());

        assertThat(actual, containsInAnyOrder(
                allOf(hasProperty("name", is("b-tag")), hasProperty("color", is("#111111"))),
                allOf(hasProperty("name", is("a-tag")), hasProperty("color", is("#222222")))
        ));
    }

    @Test
    public void findAllByUserTwo() {
        List<SubscriptionTag> actual = subscriptionTagRepository.findAllByUserId(user2.getId());

        assertThat(actual, containsInAnyOrder(
                allOf(hasProperty("name", is("tag3")), hasProperty("color", is("#333333")))
        ));
    }

    @Test
    public void findAllByUserIdOrderedByName() {
        List<SubscriptionTag> actual = subscriptionTagRepository.findAllByUserId(user1.getId());

        assertThat(actual, contains(
                hasProperty("name", is("a-tag")),
                hasProperty("name", is("b-tag"))
        ));
    }
}
