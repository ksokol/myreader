package myreader.service.subscription;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.repository.SubscriptionRepository;
import myreader.service.feed.FeedService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.hasProperty;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.hamcrest.MockitoHamcrest.argThat;

@RunWith(MockitoJUnitRunner.class)
public class SubscriptionServiceTests {

  private static final String FEED_URL = "feed url";

  private SubscriptionService subscriptionService;
  private final SubscriptionRepository subscriptionRepository = mock(SubscriptionRepository.class);
  private final FeedService feedService = mock(FeedService.class);
  private final Clock clock = Clock.fixed(Instant.EPOCH, ZoneId.of("UTC"));

  @Before
  public void setUp() {
    subscriptionService = new SubscriptionService(subscriptionRepository, feedService, clock);
  }

  @Test(expected = SubscriptionExistException.class)
  public void shouldRejectSubscriptionWhenSubscriptionAlreadyExists() {
    given(subscriptionRepository.findByFeedUrl(FEED_URL)).willReturn(Optional.of(new Subscription()));

    subscriptionService.subscribe(FEED_URL);
  }

  @Test
  public void shouldAcceptNewSubscription() {
    Feed feed = new Feed("title", "url");
    feed.setTitle("expected feed title");

    given(feedService.findByUrl(FEED_URL)).willReturn(feed);

    subscriptionService.subscribe(FEED_URL);

    verify(subscriptionRepository).save(argThat(allOf(
      hasProperty("title", is("expected feed title")),
      hasProperty("feed", is(feed)),
      hasProperty("createdAt", is(Date.from(Instant.EPOCH)))
    )));
  }

  @Test
  public void shouldReturnNewSubscription() {
    given(feedService.findByUrl(FEED_URL)).willReturn(new Feed("title", "url"));

    Subscription expectedSubscription = new Subscription();
    given(subscriptionRepository.save(Mockito.any(Subscription.class))).willReturn(expectedSubscription);

    Subscription actualSubscription = subscriptionService.subscribe(FEED_URL);

    assertThat(actualSubscription, is(expectedSubscription));
  }

}
