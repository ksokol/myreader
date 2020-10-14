package myreader.repository;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionTag;
import myreader.entity.User;
import myreader.test.ClearDb;
import myreader.test.TestUser;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Collections;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;

@ExtendWith(SpringExtension.class)
@ClearDb
@DataJpaTest(showSql = false)
@WithTestProperties
class SubscriptionTagRepositoryTests {

    @Autowired
    private SubscriptionTagRepository subscriptionTagRepository;

    @Autowired
    private TestEntityManager em;

    private User user1;
    private User user2;
    private SubscriptionTag subscriptionTag1;
    private SubscriptionTag subscriptionTag3;

    @BeforeEach
    void setUp() {
        user1 = em.persist(TestUser.USER1.toUser());
        user2 = em.persist(TestUser.USER4.toUser());

        var feed1 = em.persist(new Feed("irrelevant", "irrelevant"));
        var feed2 = em.persist(new Feed("irrelevant", "irrelevant"));

        var subscription1 = em.persist(new Subscription(user1, feed1));
        var subscription2 = em.persist(new Subscription(user1, feed2));
        var subscription3 = em.persist(new Subscription(user2, feed1));

        subscriptionTag1 = new SubscriptionTag("b-tag", user1);
        subscriptionTag1.setColor("#111111");
        subscriptionTag1.setSubscriptions(Collections.singleton(subscription1));
        em.persistAndFlush(subscriptionTag1);

        var subscriptionTag2 = new SubscriptionTag("a-tag", user1);
        subscriptionTag2.setColor("#222222");
        subscriptionTag2.setSubscriptions(Collections.singleton(subscription2));
        em.persistAndFlush(subscriptionTag2);

        subscriptionTag3 = new SubscriptionTag("tag3", user2);
        subscriptionTag3.setColor("#333333");
        subscriptionTag3.setSubscriptions(Collections.singleton(subscription3));
        em.persistAndFlush(subscriptionTag3);
    }

    @Test
    void shouldFindByTagAndUserIdForUser1() {
        var subscriptionTag = subscriptionTagRepository
                .findByTagAndUserId(subscriptionTag1.getName(), user1.getId())
                .orElseThrow(AssertionError::new);

        assertThat(subscriptionTag, hasProperty("name", is("b-tag")));
    }

    @Test
    void shouldFindByTagAndUserIdForUser2() {
        var subscriptionTag = subscriptionTagRepository
                .findByTagAndUserId(subscriptionTag3.getName(), user2.getId())
                .orElseThrow(AssertionError::new);

        assertThat(subscriptionTag, hasProperty("name", is("tag3")));
    }

    @Test
    void shouldNotFindByTagAndUserIdForUser2() {
        var subscriptionTag = subscriptionTagRepository
                .findByTagAndUserId(subscriptionTag1.getName(), user2.getId());

        assertThat(subscriptionTag.isPresent(), is(false));
    }

    @Test
    void shouldFindByIdAndUserIdForUser1() {
        var subscriptionTag = subscriptionTagRepository
                .findByIdAndUserId(subscriptionTag1.getId(), user1.getId())
                .orElseThrow(AssertionError::new);

        assertThat(subscriptionTag, hasProperty("name", is("b-tag")));
    }

    @Test
    void shouldFindByIdAndUserIdForUser2() {
        var subscriptionTag = subscriptionTagRepository
                .findByIdAndUserId(subscriptionTag3.getId(), user2.getId())
                .orElseThrow(AssertionError::new);

        assertThat(subscriptionTag, hasProperty("name", is("tag3")));
    }

    @Test
    void shouldNotFindByIdAndUserIdForUser2() {
        var subscriptionTag = subscriptionTagRepository
                .findByIdAndUserId(subscriptionTag1.getId(), user2.getId());

        assertThat(subscriptionTag.isPresent(), is(false));
    }

    @Test
    void findAllByUserOne() {
        var actual = subscriptionTagRepository.findAllByUserId(user1.getId());

        assertThat(actual, containsInAnyOrder(
                allOf(hasProperty("name", is("b-tag")), hasProperty("color", is("#111111"))),
                allOf(hasProperty("name", is("a-tag")), hasProperty("color", is("#222222")))
        ));
    }

    @Test
    void findAllByUserTwo() {
        var actual = subscriptionTagRepository.findAllByUserId(user2.getId());

        assertThat(actual, containsInAnyOrder(
                allOf(hasProperty("name", is("tag3")), hasProperty("color", is("#333333")))
        ));
    }

    @Test
    void findAllByUserIdOrderedByName() {
        var actual = subscriptionTagRepository.findAllByUserId(user1.getId());

        assertThat(actual, contains(
                hasProperty("name", is("a-tag")),
                hasProperty("name", is("b-tag"))
        ));
    }
}
