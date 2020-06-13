package myreader.resource.subscription;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionTag;
import myreader.entity.User;
import myreader.repository.SubscriptionRepository;
import myreader.repository.SubscriptionTagRepository;
import myreader.test.TestUser;
import myreader.test.WithAuthenticatedUser;
import myreader.test.WithTestProperties;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.stubbing.Answer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;
import java.util.Optional;

import static myreader.test.CustomMockMvcResultMatchers.validation;
import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.hamcrest.MockitoHamcrest.argThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@WithTestProperties
@WithAuthenticatedUser(TestUser.USER4)
public class SubscriptionEntityResourceTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SubscriptionRepository subscriptionRepository;

    @MockBean
    private SubscriptionTagRepository subscriptionTagRepository;

    @Before
    public void setUp() {
        SubscriptionTag subscriptionTag = new SubscriptionTag();
        subscriptionTag.setId(2L);
        subscriptionTag.setName("subscriptiontag name");
        subscriptionTag.setColor("#111111");
        subscriptionTag.setCreatedAt(new Date(1000));

        Feed feed = new Feed();
        feed.setUrl("http://feeds.feedburner.com/javaposse");

        Subscription subscription = new Subscription(new User(TestUser.USER4.email), feed);
        subscription.setId(1L);
        subscription.setTitle("expected title");
        subscription.setSubscriptionTag(subscriptionTag);
        subscription.setFetchCount(15);
        subscription.setUnseen(10);
        subscription.setCreatedAt(new Date(2000));

        given(subscriptionRepository.findByIdAndUserId(subscription.getId(), TestUser.USER4.id))
                .willReturn(Optional.of(subscription));
    }

    @Test
    public void shouldReturnResponse() throws Exception {
        mockMvc.perform(get("/api/2/subscriptions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid", is("1")))
                .andExpect(jsonPath("$.title", is("expected title")))
                .andExpect(jsonPath("$.sum", is(15)))
                .andExpect(jsonPath("$.unseen", is(10)))
                .andExpect(jsonPath("$.origin", is("http://feeds.feedburner.com/javaposse")))
                .andExpect(jsonPath("$.feedTag.uuid", is("2")))
                .andExpect(jsonPath("$.feedTag.name", is("subscriptiontag name")))
                .andExpect(jsonPath("$.feedTag.color", is("#111111")))
                .andExpect(jsonPath("$.feedTag.createdAt", is("1970-01-01T00:00:01.000+00:00")))
                .andExpect(jsonPath("$.createdAt", is("1970-01-01T00:00:02.000+00:00")));
    }

    @Test
    public void shouldDeleteSubscription() throws Exception {
        mockMvc.perform(delete("/api/2/subscriptions/1"))
                .andExpect(status().isNoContent());

        verify(subscriptionRepository).delete(argThat(hasProperty("id", is(1L))));
    }

    @Test
    public void shouldReturnNotFoundWhenDeletingSubscriptionThatIsNotOwnedByCurrentUser() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptions/2")
                .with(jsonBody("{'title': 'irrelevant',  'tag' : 'irrelevant'}")))
                .andExpect(status().isNotFound());
    }

    @Test
    public void shouldPatchSubscription() throws Exception {
        given(subscriptionTagRepository.save(any())).willAnswer((Answer<SubscriptionTag>) invocation -> {
            SubscriptionTag tag = (SubscriptionTag) invocation.getArguments()[0];
            tag.setId(3L);
            return tag;
        });

        mockMvc.perform(patch("/api/2/subscriptions/1")
                .with(jsonBody("{'title': 'changed title', 'feedTag': {'name':'changed name', 'color': '#222222'}}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("title", is("changed title")))
                .andExpect(jsonPath("feedTag.uuid", is("3")))
                .andExpect(jsonPath("feedTag.name", is("changed name")))
                .andExpect(jsonPath("feedTag.color", is("#222222")));

        verify(subscriptionRepository).save(argThat(hasProperty("title", is("changed title"))));
        verify(subscriptionTagRepository).save(argThat(allOf(
                hasProperty("name", is("changed name")),
                hasProperty("color", is("#222222"))
        )));
    }

    @Test
    public void shouldRejectPatchRequestWhenTitleAndFeedTagNamePropertyIsAbsent() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptions/1")
                .with(jsonBody("{'feedTag': {}}")))
                .andExpect(status().isBadRequest())
                .andExpect(validation().onField("title", is("may not be empty")))
                .andExpect(validation().onField("feedTag.name", is("may not be empty")));
    }

    @Test
    public void shouldValidateSubscriptionTitle() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptions/1")
                .with(jsonBody("{'title': ' '}")))
                .andExpect(status().isBadRequest())
                .andExpect(validation().onField("title", is("may not be empty")));
    }

    @Test
    public void shouldValidateSubscriptionTagName() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptions/1")
                .with(jsonBody("{'title': 'irrelevant', 'feedTag': {'name': ' '}}")))
                .andExpect(status().isBadRequest())
                .andExpect(validation().onField("feedTag.name", is("may not be empty")));
    }
}
