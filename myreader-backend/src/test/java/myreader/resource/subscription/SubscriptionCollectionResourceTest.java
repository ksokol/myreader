package myreader.resource.subscription;

import myreader.service.time.TimeService;
import myreader.test.IntegrationTestSupport;
import myreader.test.KnownUser;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;

import java.time.Instant;
import java.util.Date;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.actionAsUserX;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.postAsUser102;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.postAsUser2;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
public class SubscriptionCollectionResourceTest extends IntegrationTestSupport {

    @Autowired
    private TimeService timeServiceMock;

    @Test
    public void testCollectionResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(actionAsUserX(HttpMethod.GET, KnownUser.USER116, "/api/2/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/structure.json"));
    }

    @Test
    public void unseenGreaterThanMinusOne() throws Exception {
        mockMvc.perform(getAsUser2("/api/2/subscriptions?unseenGreaterThan=-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("content..uuid", hasSize(6)));
    }

    @Test
    public void unseenGreaterThanZeroOne() throws Exception {
        mockMvc.perform(getAsUser2("/api/2/subscriptions?unseenGreaterThan=1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("content..uuid", hasSize(0)));
    }

    @Test
    public void testFieldErrorWhenUrlIsEmpty() throws Exception {
        mockMvc.perform(postAsUser2("/api/2/subscriptions")
                .json("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("status", is(400)))
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", contains("origin", "origin")))
                .andExpect(jsonPath("fieldErrors..message", hasItems("invalid syndication feed", "may not be null")));
    }

    @Test
    public void testFieldErrorWhenUrlHasInvalidPattern() throws Exception {
        mockMvc.perform(postAsUser2("/api/2/subscriptions")
                .json("{'url':'invalid url'}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", contains("origin", "origin")))
                .andExpect(jsonPath("fieldErrors..message", hasItems("invalid syndication feed", "may not be null")));
    }

    @Test
    public void testFieldErrorWhenPostingExistentSubscription() throws Exception {
        mockMvc.perform(postAsUser2("/api/2/subscriptions")
                .json("{ 'origin' : 'http://martinfowler.com/feed.atom' }"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", contains("origin")))
                .andExpect(jsonPath("fieldErrors..message", contains("subscription exists")));
    }

    @Test
    public void testSuccessWhenPostingNewSubscription() throws Exception {
        Date now = Date.from(Instant.parse("2014-04-30T12:43:46Z"));

        when(timeServiceMock.getCurrentTime()).thenReturn(now);

        mockMvc.perform(postAsUser102("/api/2/subscriptions")
                .json("{ 'origin': 'http://use-the-index-luke.com/blog/feed' }"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/post-new-response.json"));
    }

    @Test
    public void testAvailableTags() throws Exception {
        mockMvc.perform(getAsUser2("/api/2/subscriptions/availableTags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasItems("tag1", "tag2")));
    }
}
