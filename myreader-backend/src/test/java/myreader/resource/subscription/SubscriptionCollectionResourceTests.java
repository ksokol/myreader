package myreader.resource.subscription;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionTag;
import myreader.entity.User;
import myreader.repository.SubscriptionRepository;
import myreader.service.feed.FeedService;
import myreader.service.subscription.SubscriptionService;
import myreader.test.TestUser;
import myreader.test.WithAuthenticatedUser;
import myreader.test.WithTestProperties;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

import static myreader.test.CustomMockMvcResultMatchers.validation;
import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@WithTestProperties
@WithAuthenticatedUser(TestUser.USER2)
public class SubscriptionCollectionResourceTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SubscriptionService subscriptionService;

    @MockBean
    private SubscriptionRepository subscriptionRepository;

    @MockBean
    private FeedService feedService;

    private Subscription subscription1;
    private Subscription subscription2;

    @Before
    public void setUp() {
        User user = new User(TestUser.USER2.email);

        Feed feed1 = new Feed();
        feed1.setUrl("http://feeds.feedburner.com/javaposse");

        SubscriptionTag subscriptionTag1 = new SubscriptionTag("tag1", user);
        subscriptionTag1.setId(21L);
        subscriptionTag1.setCreatedAt(new Date(1000));

        subscription1 = new Subscription(user, feed1);
        subscription1.setId(1104L);
        subscription1.setTitle("user102_subscription1");
        subscription1.setFetchCount(10);
        subscription1.setUnseen(5);
        subscription1.setSubscriptionTag(subscriptionTag1);
        subscription1.setCreatedAt(new Date(2000));

        Feed feed2 = new Feed();
        feed2.setUrl("http://use-the-index-luke.com/blog/feed");

        SubscriptionTag subscriptionTag2 = new SubscriptionTag("tag2", user);
        subscriptionTag2.setId(22L);
        subscriptionTag2.setColor("#ffffff");
        subscriptionTag2.setCreatedAt(new Date(3000));

        subscription2 = new Subscription(user, feed2);
        subscription2.setId(1105L);
        subscription2.setTitle("user102_subscription2");
        subscription2.setFetchCount(20);
        subscription2.setUnseen(0);
        subscription2.setUnseen(0);
        subscription2.setSubscriptionTag(subscriptionTag2);
        subscription2.setCreatedAt(new Date(4000));
    }

    @Test
    public void shouldReturnExpectedJsonStructure() throws Exception {
        given(subscriptionRepository.findAllByUnseenGreaterThanAndUserId(-1, TestUser.USER2.id))
                .willReturn(Arrays.asList(subscription1, subscription2));

        mockMvc.perform(get("/api/2/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].uuid", is("1104")))
                .andExpect(jsonPath("$.content[0].title", is("user102_subscription1")))
                .andExpect(jsonPath("$.content[0].sum", is(10)))
                .andExpect(jsonPath("$.content[0].unseen", is(5)))
                .andExpect(jsonPath("$.content[0].origin", is("http://feeds.feedburner.com/javaposse")))
                .andExpect(jsonPath("$.content[0].feedTag.uuid", is("21")))
                .andExpect(jsonPath("$.content[0].feedTag.name", is("tag1")))
                .andExpect(jsonPath("$.content[0].feedTag.color", nullValue()))
                .andExpect(jsonPath("$.content[0].feedTag.createdAt", is("1970-01-01T00:00:01.000+0000")))
                .andExpect(jsonPath("$.content[0].createdAt", is("1970-01-01T00:00:02.000+0000")))
                .andExpect(jsonPath("$.content[1].uuid", is("1105")))
                .andExpect(jsonPath("$.content[1].title", is("user102_subscription2")))
                .andExpect(jsonPath("$.content[1].sum", is(20)))
                .andExpect(jsonPath("$.content[1].unseen", is(0)))
                .andExpect(jsonPath("$.content[1].origin", is("http://use-the-index-luke.com/blog/feed")))
                .andExpect(jsonPath("$.content[1].feedTag.uuid", is("22")))
                .andExpect(jsonPath("$.content[1].feedTag.name", is("tag2")))
                .andExpect(jsonPath("$.content[1].feedTag.color", is("#ffffff")))
                .andExpect(jsonPath("$.content[1].feedTag.createdAt", is("1970-01-01T00:00:03.000+0000")))
                .andExpect(jsonPath("$.content[1].createdAt", is("1970-01-01T00:00:04.000+0000")));
    }

    @Test
    public void shouldPassQueryParameterUnseenGreaterThanToFinderMethod() throws Exception {
        mockMvc.perform(get("/api/2/subscriptions?unseenGreaterThan=10"))
                .andExpect(status().isOk());

        verify(subscriptionRepository).findAllByUnseenGreaterThanAndUserId(10, TestUser.USER2.id);
    }

    @Test
    public void shouldRejectPostRequestWhenOriginIsMissing() throws Exception {
        mockMvc.perform(post("/api/2/subscriptions")
                .with(jsonBody("{}")))
                .andExpect(status().isBadRequest())
                .andExpect(validation().onField("origin", is("must begin with http(s)://")));
    }

    @Test
    public void shouldRejectPostRequestWhenOriginContainsAnInvalidUrl() throws Exception {
        mockMvc.perform(post("/api/2/subscriptions")
                .with(jsonBody("{'url':'invalid url'}")))
                .andExpect(status().isBadRequest())
                .andExpect(validation().onField("origin", is("must begin with http(s)://")));
    }

    @Test
    public void shouldRejectPostRequestWhenSubscriptionAlreadyExistsForGivenOrigin() throws Exception {
        given(subscriptionRepository.findByFeedUrlAndUserId("http://feeds.feedburner.com/javaposse", TestUser.USER2.id))
                .willReturn(Optional.of(subscription1));

        mockMvc.perform(post("/api/2/subscriptions")
                .with(jsonBody("{'origin' : 'http://feeds.feedburner.com/javaposse'}")))
                .andExpect(status().isBadRequest())
                .andExpect(validation().onField("origin", is("subscription exists")));
    }

    @Test
    public void shouldRejectPostRequestWhenOriginIsAnInvalidSyndication() throws Exception {
        String url = "http://martinfowler.com/feed.atom";

        given(subscriptionRepository.findByFeedUrlAndUserId(url, TestUser.USER2.id))
                .willReturn(Optional.empty());
        given(feedService.valid(url)).willReturn(false);

        mockMvc.perform(post("/api/2/subscriptions")
                .with(jsonBody("{'origin' : '" + url + "'}")))
                .andExpect(status().isBadRequest())
                .andExpect(validation().onField("origin", is("invalid syndication feed")));
    }

    @Test
    public void shouldCreateNewSubscriptionForOrigin() throws Exception {
        String url = "http://use-the-index-luke.com/blog/feed";

        Feed feed = new Feed("irrelevant", "irrelevant");
        feed.setUrl(url);
        Subscription subscription = new Subscription(new User(TestUser.USER2.email), feed);
        subscription.setId(9999L);
        subscription.setTitle("expected title");
        subscription.setCreatedAt(new Date(1000));

        given(subscriptionRepository.findByFeedUrlAndUserId(url, TestUser.USER2.id))
                .willReturn(Optional.empty());
        given(feedService.valid(url))
                .willReturn(true);
        given(subscriptionService.subscribe(TestUser.USER2.email, url))
                .willReturn(subscription);

        mockMvc.perform(post("/api/2/subscriptions")
                .with(jsonBody("{'origin': '" + url + "'}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("uuid", is("9999")))
                .andExpect(jsonPath("title", is("expected title")))
                .andExpect(jsonPath("sum", is(0)))
                .andExpect(jsonPath("unseen", is(0)))
                .andExpect(jsonPath("origin", is(url)))
                .andExpect(jsonPath("feedTag", nullValue()))
                .andExpect(jsonPath("createdAt", is("1970-01-01T00:00:01.000+0000")));
    }
}
