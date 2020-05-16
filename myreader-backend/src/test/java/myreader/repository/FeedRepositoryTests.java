package myreader.repository;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.test.WithTestProperties;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@DataJpaTest(showSql = false)
@WithTestProperties
public class FeedRepositoryTests {

    @Autowired
    private FeedRepository feedRepository;

    @Autowired
    private TestEntityManager em;

    @Test
    public void shouldFindFeedWithoutSubscription() {
        em.persist(new Feed("http://localhost", "feed without subscription"));

        User user = new User("email");
        em.persist(user);

        Feed feed = new Feed("http://localhost", "feed with subscription");
        em.persist(feed);

        em.persist(new Subscription(user, feed));

        List<Feed> actual = feedRepository.findByZeroSubscriptions();

        assertThat(actual, hasSize(1));
        assertThat(actual.get(0).getTitle(), is("feed without subscription"));
    }

    @Test
    public void shouldFindByUrlIn() {
        em.persist(new Feed("http://url1","feed1"));
        em.persist(new Feed("http://url2","feed2"));
        em.persist(new Feed("http://url3","feed3"));

        Page<Feed> actual = feedRepository.findByUrlIn(Arrays.asList("http://url1", "http://url3"), PageRequest.of(0, 10));

        assertThat(actual.getContent(), contains(
                hasProperty("url", is("http://url1")),
                hasProperty("url", is("http://url3"))
        ));
    }
}
