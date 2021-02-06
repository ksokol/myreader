package myreader.repository;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionTag;
import myreader.test.ClearDb;
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

  private SubscriptionTag subscriptionTag1;
  private SubscriptionTag subscriptionTag3;

  @BeforeEach
  void setUp() {
    var feed1 = em.persist(new Feed("irrelevant", "irrelevant"));
    var feed2 = em.persist(new Feed("irrelevant", "irrelevant"));

    var subscription1 = em.persist(new Subscription(feed1));
    var subscription2 = em.persist(new Subscription(feed2));
    var subscription3 = em.persist(new Subscription(feed1));

    subscriptionTag1 = new SubscriptionTag("b-tag", subscription1);
    subscriptionTag1.setColor("#111111");
    em.persistAndFlush(subscriptionTag1);

    var subscriptionTag2 = new SubscriptionTag("a-tag", subscription1);
    subscriptionTag2.setColor("#222222");
    em.persistAndFlush(subscriptionTag2);

    subscriptionTag3 = new SubscriptionTag("tag3", subscription3);
    subscriptionTag3.setColor("#333333");
    subscriptionTag3.setSubscriptions(Collections.singleton(subscription3));
    em.persistAndFlush(subscriptionTag3);

    subscription1.setSubscriptionTag(subscriptionTag1);
    subscription1 = em.persistAndFlush(subscription1);

    subscription2.setSubscriptionTag(subscriptionTag2);
    em.persistAndFlush(subscription1);

    subscription3.setSubscriptionTag(subscriptionTag3);
    em.persistAndFlush(subscription3);
  }

  @Test
  void shouldFindByTag() {
    var subscriptionTag = subscriptionTagRepository
      .findByTag(subscriptionTag3.getName())
      .orElseThrow(AssertionError::new);

    assertThat(subscriptionTag, hasProperty("name", is("tag3")));
  }

  @Test
  void shouldNotFindByTag() {
    var subscriptionTag = subscriptionTagRepository
      .findByTag("unknown");

    assertThat(subscriptionTag.isPresent(), is(false));
  }

  @Test
  void shouldFindById() {
    var subscriptionTag = subscriptionTagRepository
      .findById(subscriptionTag1.getId())
      .orElseThrow(AssertionError::new);

    assertThat(subscriptionTag, hasProperty("name", is("b-tag")));
  }

  @Test
  void shouldNotFindById() {
    var subscriptionTag = subscriptionTagRepository
      .findById(999L);

    assertThat(subscriptionTag.isPresent(), is(false));
  }

  @Test
  void findAll() {
    var actual = subscriptionTagRepository.findAll();

    assertThat(actual, containsInAnyOrder(
      allOf(hasProperty("name", is("b-tag")), hasProperty("color", is("#111111"))),
      allOf(hasProperty("name", is("a-tag")), hasProperty("color", is("#222222"))),
      allOf(hasProperty("name", is("tag3")), hasProperty("color", is("#333333")))
    ));
  }
}
