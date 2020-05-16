package myreader.resource.subscription;

import myreader.test.TestConstants;
import myreader.test.WithTestProperties;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static myreader.test.CustomMockMvcResultMatchers.validation;
import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
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
@Sql("classpath:test-data.sql")
@WithTestProperties
public class SubscriptionEntityResourceTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldReturnSubscriptionWhenItIsNotOwnedByCurrentUser() throws Exception {
        mockMvc.perform(get("/api/2/subscriptions/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldReturnNotFoundWhenRequestedSubscriptionIsNotOwnedByCurrentUser() throws Exception {
        mockMvc.perform(get("/api/2/subscriptions/6"))
                .andExpect(status().isNotFound());
    }


    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldReturnExpectedJsonStructure() throws Exception {
        mockMvc.perform(get("/api/2/subscriptions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid", is("1")))
                .andExpect(jsonPath("$.title", is("user1_subscription1")))
                .andExpect(jsonPath("$.sum", is(15)))
                .andExpect(jsonPath("$.unseen", is(0)))
                .andExpect(jsonPath("$.origin", is("http://feeds.feedburner.com/javaposse")))
                .andExpect(jsonPath("$.feedTag.uuid", is("1")))
                .andExpect(jsonPath("$.feedTag.name", is("tag1")))
                .andExpect(jsonPath("$.feedTag.color", nullValue()))
                .andExpect(jsonPath("$.feedTag.createdAt", is("2011-05-15T19:20:46.000+0000")))
                .andExpect(jsonPath("$.createdAt", is("2011-04-15T19:20:46.000+0000")));
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldDeleteSubscription() throws Exception {
        mockMvc.perform(get("/api/2/subscriptions?unseenGreaterThan=-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content..origin", hasSize(5)))
                .andExpect(jsonPath("$.content..origin", hasItem("http://feeds.feedburner.com/javaposse")));

        mockMvc.perform(delete("/api/2/subscriptions/1"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/2/subscriptions?unseenGreaterThan=-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content..origin", hasSize(4)))
                .andExpect(jsonPath("$.content..origin", not(hasItem("http://feeds.feedburner.com/javaposse"))));
    }

    @Test
    @WithMockUser(TestConstants.USER2)
    public void shouldReturnNotFoundWhenTryingToDeleteSubscriptionThatIsNotOwnedByCurrentUser() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptions/1")
                .with(jsonBody("{'title': 'irrelevant',  'tag' : 'irrelevant'}")))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(TestConstants.USER103)
    public void shouldPatchSubscription() throws Exception {
        mockMvc.perform(get("/api/2/subscriptions/101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("title", is("user103_subscription1")))
                .andExpect(jsonPath("feedTag.name", is("tag1")))
                .andExpect(jsonPath("feedTag.color", nullValue()));

        mockMvc.perform(patch("/api/2/subscriptions/101")
                .with(jsonBody("{'title': 'expected title', 'feedTag': {'name':'expected name', 'color': 'expected color'}}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("title", is("expected title")))
                .andExpect(jsonPath("feedTag.name", is("expected name")))
                .andExpect(jsonPath("feedTag.color", is("expected color")));

        mockMvc.perform(patch("/api/2/subscriptions/101")
                .with(jsonBody("{'title': 'expected title2'}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("title", is("expected title2")))
                .andExpect(jsonPath("feedTag", nullValue()));
    }

    @Test
    @WithMockUser(TestConstants.USER103)
    public void shouldValidateSubscriptionTitle() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptions/101")
                .with(jsonBody("{'title': ' '}")))
                .andExpect(status().isBadRequest())
                .andExpect(validation().onField("title", is("may not be empty")));
    }

    @Test
    @WithMockUser(TestConstants.USER103)
    public void shouldValidateSubscriptionTagName() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptions/101")
                .with(jsonBody("{'title': 'irrelevant', 'feedTag': {'name': ' '}}")))
                .andExpect(status().isBadRequest())
                .andExpect(validation().onField("feedTag.name", is("may not be empty")));
    }

    @Test
    @WithMockUser(TestConstants.USER116)
    public void shouldUpdateColorForAllSubscriptionsWithGivenTag() throws Exception {
        mockMvc.perform(get("/api/2/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("content..feedTag.color", hasItems(nullValue(), nullValue())));

        mockMvc.perform(patch("/api/2/subscriptions/1104")
                .with(jsonBody("{'title': 'user116_subscription1', 'feedTag': {'name':'tag1', 'color': '#777'}}")))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/2/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("content..feedTag.color", hasItems(is("#777"), is("#777"))));
    }
}
