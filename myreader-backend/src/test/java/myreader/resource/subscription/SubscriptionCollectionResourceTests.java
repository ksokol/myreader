package myreader.resource.subscription;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.service.subscription.SubscriptionService;
import myreader.test.TestConstants;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.TimeZone;

import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.willReturn;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@TestPropertySource(properties = {"task.enabled = false"})
@Sql("classpath:test-data.sql")
public class SubscriptionCollectionResourceTests {

    static {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    @Autowired
    private MockMvc mockMvc;

    @SpyBean
    private SubscriptionService subscriptionService;

    @Test
    @WithMockUser(TestConstants.USER116)
    public void shouldReturnExpectedJsonStructure() throws Exception {
        mockMvc.perform(get("/api/2/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/structure.json"));
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
                .andExpect(jsonPath("status", is(400)))
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", contains("origin")))
                .andExpect(jsonPath("fieldErrors..message", hasItems("invalid syndication feed")));
    }

    @Test
    @WithMockUser(TestConstants.USER2)
    public void shouldRejectPatchRequestWhenOriginContainsAnInvalidUrl() throws Exception {
        mockMvc.perform(post("/api/2/subscriptions")
                .with(jsonBody("{'url':'invalid url'}")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", contains("origin")))
                .andExpect(jsonPath("fieldErrors..message", hasItems("invalid syndication feed")));
    }

    @Test
    @WithMockUser(TestConstants.USER2)
    public void shouldRejectPatchRequestWhenSubscriptionAlreadyExistsForGivenOrigin() throws Exception {
        mockMvc.perform(post("/api/2/subscriptions")
                .with(jsonBody("{'origin' : 'http://martinfowler.com/feed.atom'}")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", contains("origin")))
                .andExpect(jsonPath("fieldErrors..message", contains("subscription exists")));
    }

    @Test
    @WithMockUser(TestConstants.USER102)
    public void shouldCreateNewSubscriptionForOrigin() throws Exception {
        Subscription subscription = new Subscription(new User("irrelevant"), new Feed("irrelevant", "irrelevant"));
        subscription.setId(1L);
        subscription.setTitle("expected title");

        willReturn(subscription).given(subscriptionService).subscribe(TestConstants.USER102, "http://use-the-index-luke.com/blog/feed");

        mockMvc.perform(post("/api/2/subscriptions")
                .with(jsonBody("{'origin': 'http://use-the-index-luke.com/blog/feed'}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("title", is("expected title")));
    }
}