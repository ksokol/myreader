package myreader.service.subscription;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.fetcher.FeedParser;
import myreader.fetcher.impl.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedRepository;
import myreader.repository.SubscriptionRepository;
import myreader.repository.UserRepository;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

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

        assertThat(newSubscription.getFeed(), is(newFeed));
        assertThat(newSubscription, hasProperty("title", is(feedTitle)));
        assertThat(newSubscription, hasProperty("user", is(user)));
    }

}
