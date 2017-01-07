package myreader.repository;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class FeedRepositoryTest {

    @Autowired
    private FeedRepository feedRepository;

    @Autowired
    private TestEntityManager em;

    @Test
    public void shouldFindFeedWithoutSubscription() throws Exception {
        em.persist(new Feed("feed without subscription"));

        User user = new User("email");
        em.persist(user);

        Feed feed = new Feed("feed with subscription");
        em.persist(feed);

        em.persist(new Subscription(user, feed));

        List<Feed> actual = feedRepository.findByZeroSubscriptions();

        assertThat(actual, hasSize(1));
        assertThat(actual.get(0).getTitle(), is("feed without subscription"));
    }
}
