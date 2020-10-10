package myreader.fetcher.jobs;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.repository.FeedRepository;
import myreader.test.TestUser;
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
@SpringBootTest
@WithTestProperties
public class FeedPurgeJobTests {

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
    public void shouldDeleteFeedsWithoutSubscription() {
        var user = new User(TestUser.USER4.email);
        em.persist(user);

        var feed1 = new Feed("http://localhost", "expected title1");
        em.persist(feed1);

        var feed2 = new Feed("http://localhost", "expected title2");
        feed2 = em.persist(feed2);
        em.persist(new Subscription(user, feed2));

        job.work();

        assertThat(em.find(Feed.class, feed1.getId()), nullValue());
        assertThat(em.find(Feed.class, feed2.getId()), is(feed2));
    }
}
