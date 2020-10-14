package myreader.resource.subscription;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionTag;
import myreader.test.ClearDb;
import myreader.test.WithAuthenticatedUser;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import javax.transaction.Transactional;
import java.util.Date;

import static myreader.test.CustomMockMvcResultMatchers.validation;
import static myreader.test.TestUser.USER4;
import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@AutoConfigureTestEntityManager
@Transactional
@ClearDb
@SpringBootTest
@WithTestProperties
@WithAuthenticatedUser(USER4)
class SubscriptionEntityResourceTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TestEntityManager em;

    private Subscription subscription;
    private SubscriptionTag subscriptionTag;

    @BeforeEach
    void setUp() {
        var user = em.persist(USER4.toUser());
        var feed = em.persistFlushFind(new Feed("http://example.com", "feed title"));

        subscriptionTag = new SubscriptionTag("subscriptiontag name", user);
        subscriptionTag.setColor("#111111");
        subscriptionTag.setCreatedAt(new Date(1000));
        subscriptionTag = em.persist(subscriptionTag);

        subscription = new Subscription(user, feed);
        subscription.setTitle("expected title");
        subscription.setSubscriptionTag(subscriptionTag);
        subscription.setFetchCount(15);
        subscription.setUnseen(10);
        subscription.setCreatedAt(new Date(2000));
        subscription = em.persist(subscription);
    }

    @Test
    void shouldReturnResponse() throws Exception {
        mockMvc.perform(get("/api/2/subscriptions/{id}", subscription.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid", is(subscription.getId().toString())))
                .andExpect(jsonPath("$.title", is("expected title")))
                .andExpect(jsonPath("$.sum", is(15)))
                .andExpect(jsonPath("$.unseen", is(10)))
                .andExpect(jsonPath("$.origin", is("http://example.com")))
                .andExpect(jsonPath("$.feedTag.uuid", is(subscriptionTag.getId().toString())))
                .andExpect(jsonPath("$.feedTag.name", is("subscriptiontag name")))
                .andExpect(jsonPath("$.feedTag.color", is("#111111")))
                .andExpect(jsonPath("$.feedTag.createdAt", is("1970-01-01T00:00:01.000+00:00")))
                .andExpect(jsonPath("$.createdAt", is("1970-01-01T00:00:02.000+00:00")));
    }

    @Test
    void shouldDeleteSubscription() throws Exception {
        mockMvc.perform(delete("/api/2/subscriptions/{id}", subscription.getId()))
                .andExpect(status().isNoContent());

        assertThat(em.find(Subscription.class, subscription.getId())).isNull();
    }

    @Test
    void shouldReturnNotFoundWhenDeletingSubscriptionThatIsNotOwnedByCurrentUser() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptions/9999")
                .with(jsonBody("{'title': 'irrelevant',  'tag' : 'irrelevant'}")))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldPatchSubscription() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription.getId())
                .with(jsonBody("{'title': 'changed title', 'feedTag': {'name':'changed name', 'color': '#222222'}}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("title", is("changed title")))
                .andExpect(jsonPath("feedTag.uuid", is(not(subscriptionTag.getId().toString()))))
                .andExpect(jsonPath("feedTag.name", is("changed name")))
                .andExpect(jsonPath("feedTag.color", is("#222222")));

        var subscription = em.find(Subscription.class, this.subscription.getId());
        assertThat(subscription).hasFieldOrPropertyWithValue("title", "changed title");
        assertThat(subscription.getSubscriptionTag()).hasFieldOrPropertyWithValue("name", "changed name");
        assertThat(subscription.getSubscriptionTag()).hasFieldOrPropertyWithValue("color", "#222222");
    }

    @Test
    void shouldRejectPatchRequestWhenTitleAndFeedTagNamePropertyIsAbsent() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription.getId())
                .with(jsonBody("{'feedTag': {}}")))
                .andExpect(status().isBadRequest())
                .andExpect(validation().onField("title", is("may not be empty")))
                .andExpect(validation().onField("feedTag.name", is("may not be empty")));
    }

    @Test
    void shouldValidateSubscriptionTitle() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription.getId())
                .with(jsonBody("{'title': ' '}")))
                .andExpect(status().isBadRequest())
                .andExpect(validation().onField("title", is("may not be empty")));
    }

    @Test
    void shouldValidateSubscriptionTagName() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription.getId())
                .with(jsonBody("{'title': 'irrelevant', 'feedTag': {'name': ' '}}")))
                .andExpect(status().isBadRequest())
                .andExpect(validation().onField("feedTag.name", is("may not be empty")));
    }
}
