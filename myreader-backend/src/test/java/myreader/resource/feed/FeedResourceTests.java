package myreader.resource.feed;

import myreader.test.IntegrationTestSupport;
import myreader.test.KnownUser;
import org.junit.Test;
import org.springframework.http.HttpMethod;
import org.springframework.test.annotation.Rollback;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.actionAsUserX;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
public class FeedResourceTests extends IntegrationTestSupport {

    @Test
    public void shouldReturnFetchErrors() throws Exception {
        mockMvc.perform(getAsUser1("/api/2/feeds/18/fetchError"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/feeds/18/fetchError/response.json"));
    }

    @Test
    public void shouldReturnFeedWithId18() throws Exception {
        mockMvc.perform(getAsUser1("/api/2/feeds/18"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/feeds/18.json"));
    }

    @Test
    public void shouldReturnEmptyFeedResponseForId999() throws Exception {
        mockMvc.perform(getAsUser1("/api/2/feeds/999"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/feeds/999.json"));
    }

    @Test
    public void shouldRejectDeletionWhenFeedHasSubscription() throws Exception {
        mockMvc.perform(actionAsUserX(HttpMethod.DELETE, KnownUser.ADMIN, "/api/2/feeds/1"))
                .andExpect(status().isConflict());
    }

    @Test
    public void shouldRejectDeletionWhenFeedDoesNotExist() throws Exception {
        mockMvc.perform(actionAsUserX(HttpMethod.DELETE, KnownUser.ADMIN, "/api/2/feeds/199"))
                .andExpect(status().isNotFound());
    }

    @Rollback
    @Test
    public void shouldDeleteFeed() throws Exception {
        mockMvc.perform(actionAsUserX(HttpMethod.DELETE, KnownUser.ADMIN, "/api/2/feeds/18"))
                .andExpect(status().isNoContent());
    }
}