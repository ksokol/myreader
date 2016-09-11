package myreader.service.subscription;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.repository.SubscriptionRepository;
import myreader.repository.UserRepository;
import myreader.service.feed.FeedService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Matchers;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Date;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.hasProperty;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

/**
 * @author Kamill Sokol
 */
@RunWith(MockitoJUnitRunner.class)
public class SubscriptionServiceTests {

    private static final String USERNAME = "usernamne";
    private static final String FEED_URL = "feed url";

    private SubscriptionService subscriptionService;
    private SubscriptionRepository subscriptionRepository = mock(SubscriptionRepository.class);
    private UserRepository userRepository = mock(UserRepository.class);
    private FeedService feedService = mock(FeedService.class);
    private Clock clock = Clock.fixed(Instant.EPOCH, ZoneId.of("UTC"));

    @Before
    public void setUp() {
        subscriptionService = new SubscriptionService(subscriptionRepository, userRepository, feedService, clock);
    }

    @Test(expected = SubscriptionExistException.class)
    public void shouldRejectSubscriptionWhenSubscriptionAlreadyExists() {
        given(subscriptionRepository.findByUserEmailAndFeedUrl(USERNAME, FEED_URL)).willReturn(new Subscription());

        subscriptionService.subscribe(USERNAME, FEED_URL);
    }

    @Test
    public void shouldAcceptNewSubscription() {
        User user = new User();
        Feed feed = new Feed();
        feed.setTitle("expected feed title");

        given(feedService.findByUrl(FEED_URL)).willReturn(feed);
        given(userRepository.findByEmail(USERNAME)).willReturn(user);

        subscriptionService.subscribe(USERNAME, FEED_URL);

        verify(subscriptionRepository).save(Matchers.<Subscription>argThat(allOf(
                hasProperty("title", is("expected feed title")),
                hasProperty("feed", is(feed)),
                hasProperty("user", is(user)),
                hasProperty("createdAt", is(Date.from(Instant.EPOCH)))
        )));
    }

    @Test
    public void shouldReturnNewSubscription() {
        given(feedService.findByUrl(FEED_URL)).willReturn(new Feed());

        Subscription expectedSubscription = new Subscription();
        given(subscriptionRepository.save(Mockito.any(Subscription.class))).willReturn(expectedSubscription);

        Subscription actualSubscription = subscriptionService.subscribe(USERNAME, FEED_URL);

        assertThat(actualSubscription, is(expectedSubscription));
    }

}
