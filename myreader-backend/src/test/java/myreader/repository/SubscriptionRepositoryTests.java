package myreader.repository;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
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
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;

@ExtendWith(SpringExtension.class)
@DataJpaTest(showSql = false)
@WithTestProperties
class SubscriptionRepositoryTests {

  @Autowired
  private SubscriptionRepository subscriptionRepository;

  @Autowired
  private TestEntityManager testEntityManager;

  private Subscription subscription1;
  private Subscription subscription2;

  @BeforeEach
  void before() {
    subscription1 = new Subscription("http://example1.com", "expected feed title1");
    subscription1.setTitle("expected title1");
    subscription1.setCreatedAt(new Date(1000));
    subscription1 = testEntityManager.persistFlushFind(subscription1);

    subscription2 = new Subscription("http://example2.com", "expected feed title2");
    subscription2.setTitle("expected title2");
    subscription2.setCreatedAt(new Date(2000));
    subscription2 = testEntityManager.persistFlushFind(subscription2);

    var subscriptionEntry1 = testEntityManager.persistFlushFind(new SubscriptionEntry(subscription1));
    var subscriptionEntry2 = testEntityManager.persistFlushFind(new SubscriptionEntry(subscription1));

    subscriptionEntry1.setSeen(false);
    subscriptionEntry2.setSeen(false);

    testEntityManager.persistAndFlush(subscriptionEntry1);
    testEntityManager.persistAndFlush(subscriptionEntry2);
    subscription1 = testEntityManager.refresh(subscription1);
  }

  @Test
  void shouldRecalculateSubscriptionUnseenCount() {
    assertThat(subscription1.getUnseen(), is(2));
  }

  @Test
  void shouldFindByIdAndUserIdForUser1() {
    var actual = subscriptionRepository
      .findById(subscription1.getId())
      .orElseThrow(AssertionError::new);

    assertThat(actual, hasProperty("title", is("expected title1")));
  }

  @Test
  void shouldFindById() {
    var subscription2 = new Subscription("url", "title");
    subscription2.setTitle("expected title2");
    subscription2 = testEntityManager.persistFlushFind(subscription2);

    var subscription = subscriptionRepository
      .findById(subscription2.getId())
      .orElseThrow(AssertionError::new);

    assertThat(subscription, hasProperty("title", is("expected title2")));
  }

  @Test
  void shouldNotFindBy() {
    assertThat(subscriptionRepository.findById(999L).isPresent(), is(false));
  }

  @Test
  void shouldFindAllByNegativeUnseenCount() {
    var actual = subscriptionRepository.findAllByUnseenGreaterThan(-1);

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
  void shouldFindAllByPositiveUnseenCount() {
    var actual = subscriptionRepository.findAllByUnseenGreaterThan(1);

    assertThat(actual, hasItems(
      allOf(
        hasProperty("id", is(subscription1.getId())),
        hasProperty("unseen", is(subscription1.getUnseen()))
      )
    ));
  }

  @Test
  void shouldNotFindByUnknownFeedUrl() {
    var actual = subscriptionRepository.findByUrl("unknown");

    assertThat(actual.isPresent(), is(false));
  }

  @Test
  void shouldFindByFeedUrl() {
    var actual = subscriptionRepository.findByUrl("http://example1.com")
      .orElseThrow(AssertionError::new);

    assertThat(actual, hasProperty("id", is(subscription1.getId())));
  }

  @Test
  void shouldOrderByCreatedAtDescending() {
    var actual = subscriptionRepository.findAllByUnseenGreaterThan(-1);

    assertThat(actual, contains(
      hasProperty("id", is(subscription2.getId())),
      hasProperty("id", is(subscription1.getId()))
    ));
  }
}
