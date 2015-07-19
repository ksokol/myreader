package myreader.service.subscription;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.hamcrest.core.IsNull.nullValue;
import static org.mockito.Mockito.when;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.fetcher.FeedParser;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedRepository;
import myreader.repository.SubscriptionRepository;
import myreader.repository.UserRepository;
import myreader.test.IntegrationTestSupport;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;

/**
 * @author Kamill Sokol
 */
public class SubscriptionServiceImplTest extends IntegrationTestSupport {

    @Autowired
    private SubscriptionService uut;
    @Autowired
    private FeedRepository feedRepository;
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FeedParser feedParserMock;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Test(expected = SubscriptionExistException.class)
    public void testExpectedSubscriptionExistException() {
        uut.subscribe(2L, "http://feeds.feedburner.com/SpringSourceTeamBlog");
    }

    @Test
    public void testNewFeed() {
        User user = userRepository.findOne(2L);
        String feedUrl = "http://feeds.feedblitz.com/PetriKainulainen";
        String feedTitle = "feed title";

        FetchResult fetchResult = new FetchResult(Collections.<FetcherEntry>emptyList(), "last modified", feedTitle);
        when(feedParserMock.parse(feedUrl)).thenReturn(fetchResult);

        assertThat(feedRepository.findByUrl(feedUrl), nullValue());

        Subscription newSubscription = uut.subscribe(user.getId(), feedUrl);
        Feed newFeed = feedRepository.findByUrl(feedUrl);

        assertThat(newFeed, notNullValue());
        assertThat(subscriptionRepository.findByUserIdAndFeedUrl(user.getId(), feedUrl), notNullValue());

        assertThat(newFeed, hasProperty("url", is(feedUrl)));
        assertThat(newFeed, hasProperty("title", is(feedTitle)));
        assertThat(newFeed, hasProperty("lastModified", nullValue()));

        assertThat(newSubscription.getFeed().getId(), is(newFeed.getId()));
        assertThat(newSubscription.getFeed().getUrl(), is(newFeed.getUrl()));
        assertThat(newSubscription, hasProperty("title", is(feedTitle)));
        assertThat(newSubscription, hasProperty("user", is(user)));
    }

    @Test
    public void testNewFeedUnknownUser() {
        User user = new User();
        user.setId(-99L);
        String feedUrl = "http://feeds.feedblitz.com/PetriKainulainen";
        String feedTitle = "feed title";

        FetchResult fetchResult = new FetchResult(Collections.<FetcherEntry>emptyList(), "last modified", feedTitle);
        when(feedParserMock.parse(feedUrl)).thenReturn(fetchResult);

        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage("user with uuid [-99] not found");

        uut.subscribe(user.getId(), feedUrl);
    }

}
