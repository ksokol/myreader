package myreader.service.subscription;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.fetcher.FeedParser;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedRepository;
import myreader.repository.SubscriptionRepository;
import myreader.repository.UserRepository;
import myreader.service.feed.FeedServiceImpl;
import myreader.service.subscription.impl.SubscriptionServiceImpl;
import myreader.service.time.TimeService;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Collections;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.hamcrest.core.IsNull.nullValue;
import static org.mockito.Mockito.when;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@DataJpaTest(includeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {SubscriptionServiceImpl.class, FeedServiceImpl.class}))
@TestPropertySource(properties = { "task.enabled = false" })
@Sql("/test-data.sql")
public class SubscriptionServiceImplTest {

    @Autowired
    private SubscriptionServiceImpl subscriptionService;
    @Autowired
    private FeedRepository feedRepository;
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private UserRepository userRepository;
    @MockBean
    private FeedParser feedParser;
    @MockBean
    private TimeService timeService;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Test(expected = SubscriptionExistException.class)
    public void testExpectedSubscriptionExistException() {
        subscriptionService.subscribe(2L, "http://feeds.feedburner.com/SpringSourceTeamBlog");
    }

    @Test
    public void testNewFeed() {
        User user = userRepository.findOne(2L);
        String feedUrl = "http://feeds.feedblitz.com/PetriKainulainen";
        String feedTitle = "feed title";

        FetchResult fetchResult = new FetchResult(Collections.<FetcherEntry>emptyList(), "last modified", feedTitle);
        when(feedParser.parse(feedUrl)).thenReturn(fetchResult);

        assertThat(feedRepository.findByUrl(feedUrl), nullValue());

        Subscription newSubscription = subscriptionService.subscribe(user.getId(), feedUrl);
        Feed newFeed = feedRepository.findByUrl(feedUrl);

        assertThat(newFeed, notNullValue());
        assertThat(subscriptionRepository.findByUserIdAndFeedUrl(user.getId(), feedUrl), notNullValue());

        assertThat(newFeed, hasProperty("url", is(feedUrl)));
        assertThat(newFeed, hasProperty("title", is(feedTitle)));
        assertThat(newFeed, hasProperty("lastModified", nullValue()));

        assertThat(newSubscription.getFeed().getId(), is(newFeed.getId()));
        assertThat(newSubscription.getFeed().getUrl(), is(newFeed.getUrl()));
        assertThat(newSubscription, hasProperty("title", is(feedTitle)));
        assertThat(newSubscription.getUser(), hasProperty("id", is(user.getId())));
    }

    @Test
    public void testNewFeedUnknownUser() {
        User user = new User();
        user.setId(-99L);
        String feedUrl = "http://feeds.feedblitz.com/PetriKainulainen";
        String feedTitle = "feed title";

        FetchResult fetchResult = new FetchResult(Collections.<FetcherEntry>emptyList(), "last modified", feedTitle);
        when(feedParser.parse(feedUrl)).thenReturn(fetchResult);

        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage("user with uuid [-99] not found");

        subscriptionService.subscribe(user.getId(), feedUrl);
    }

}
