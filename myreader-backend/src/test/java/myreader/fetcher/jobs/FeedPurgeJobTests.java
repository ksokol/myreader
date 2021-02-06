package myreader.fetcher.jobs;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.repository.FeedRepository;
import myreader.test.ClearDb;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.transaction.Transactional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;

@ExtendWith(SpringExtension.class)
@AutoConfigureTestEntityManager
@Transactional
@ClearDb
@SpringBootTest
@WithTestProperties
class FeedPurgeJobTests {

  @Autowired
  private TestEntityManager em;

  @Autowired
  private FeedRepository feedRepository;

  private FeedPurgeJob job;

  @BeforeEach
  public void setUp() {
    job = new FeedPurgeJob(feedRepository);
  }

  @Test
  void shouldDeleteFeedsWithoutSubscription() {
    var feed1 = em.persist(new Feed("http://localhost", "expected title1"));
    var feed2 = em.persist(new Feed("http://localhost", "expected title2"));
    em.persist(new Subscription(feed2));

    job.work();

    assertThat(em.find(Feed.class, feed1.getId()), nullValue());
    assertThat(em.find(Feed.class, feed2.getId()), is(feed2));
  }
}
