package myreader.resource.subscription;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.service.subscription.SubscriptionService;
import myreader.test.TestConstants;
import myreader.test.WithTestProperties;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static myreader.test.CustomMockMvcResultMatchers.validation;
import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.BDDMockito.given;
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
@Sql("classpath:test-data.sql")
@WithTestProperties
public class SubscriptionCollectionResourceTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SubscriptionService subscriptionService;

    @Test
    @WithMockUser(TestConstants.USER116)
    public void shouldReturnExpectedJsonStructure() throws Exception {
        mockMvc.perform(get("/api/2/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].uuid", is("1104")))
                .andExpect(jsonPath("$.content[0].title", is("user116_subscription1")))
                .andExpect(jsonPath("$.content[0].sum", is(0)))
                .andExpect(jsonPath("$.content[0].unseen", is(0)))
                .andExpect(jsonPath("$.content[0].origin", is("http://feeds.feedburner.com/javaposse")))
                .andExpect(jsonPath("$.content[0].feedTag.uuid", is("21")))
                .andExpect(jsonPath("$.content[0].feedTag.name", is("tag1")))
                .andExpect(jsonPath("$.content[0].feedTag.color", nullValue()))
                .andExpect(jsonPath("$.content[0].feedTag.createdAt", is("2011-05-15T19:20:46.000+0000")))
                .andExpect(jsonPath("$.content[0].createdAt", is("2011-04-15T19:20:46.000+0000")))
                .andExpect(jsonPath("$.content[1].uuid", is("1105")))
                .andExpect(jsonPath("$.content[1].title", is("user116_subscription2")))
                .andExpect(jsonPath("$.content[1].sum", is(0)))
                .andExpect(jsonPath("$.content[1].unseen", is(0)))
                .andExpect(jsonPath("$.content[1].origin", is("http://use-the-index-luke.com/blog/feed")))
                .andExpect(jsonPath("$.content[1].feedTag.uuid", is("21")))
                .andExpect(jsonPath("$.content[1].feedTag.name", is("tag1")))
                .andExpect(jsonPath("$.content[1].feedTag.color", nullValue()))
                .andExpect(jsonPath("$.content[1].feedTag.createdAt", is("2011-05-15T19:20:46.000+0000")))
                .andExpect(jsonPath("$.content[1].createdAt", is("2011-04-15T19:20:46.000+0000")));
    }

    @Test
    @WithMockUser(TestConstants.USER2)
    public void shouldReturnEntriesWithUnseenCountGreaterThanZero() throws Exception {
        mockMvc.perform(get("/api/2/subscriptions?unseenGreaterThan=-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("content..title", hasSize(6)));
    }

    @Test
    @WithMockUser(TestConstants.USER2)
    public void shouldReturnEntriesWithUnseenCountGreaterThanTen() throws Exception {
        mockMvc.perform(get("/api/2/subscriptions?unseenGreaterThan=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("content..uuid", hasSize(0)));
    }

    @Test
    @WithMockUser(TestConstants.USER2)
    public void shouldRejectPatchRequestWhenOriginIsMissing() throws Exception {
        mockMvc.perform(post("/api/2/subscriptions")
                .with(jsonBody("{}")))
                .andExpect(status().isBadRequest())
                .andExpect(validation().onField("origin", is("invalid syndication feed")));
    }

    @Test
    @WithMockUser(TestConstants.USER2)
    public void shouldRejectPatchRequestWhenOriginContainsAnInvalidUrl() throws Exception {
        mockMvc.perform(post("/api/2/subscriptions")
                .with(jsonBody("{'url':'invalid url'}")))
                .andExpect(status().isBadRequest())
                .andExpect(validation().onField("origin", is("invalid syndication feed")));
    }

    @Test
    @WithMockUser(TestConstants.USER2)
    public void shouldRejectPatchRequestWhenSubscriptionAlreadyExistsForGivenOrigin() throws Exception {
        mockMvc.perform(post("/api/2/subscriptions")
                .with(jsonBody("{'origin' : 'http://martinfowler.com/feed.atom'}")))
                .andExpect(status().isBadRequest())
                .andExpect(validation().onField("origin", is("subscription exists")));
    }

    @Test
    @WithMockUser(TestConstants.USER102)
    public void shouldCreateNewSubscriptionForOrigin() throws Exception {
        Subscription subscription = new Subscription(new User("irrelevant"), new Feed("irrelevant", "irrelevant"));
        subscription.setId(1L);
        subscription.setTitle("expected title");

        given(subscriptionService.subscribe(TestConstants.USER102, "http://use-the-index-luke.com/blog/feed"))
                .willReturn(subscription);

        mockMvc.perform(post("/api/2/subscriptions")
                .with(jsonBody("{'origin': 'http://use-the-index-luke.com/blog/feed'}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("title", is("expected title")));
    }
}
