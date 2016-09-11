package myreader.resource.feed;

import myreader.service.feed.FeedService;
import myreader.test.IntegrationTestSupport;
import myreader.test.KnownUser;
import org.junit.Test;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.http.HttpMethod;
import org.springframework.test.annotation.Rollback;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.willReturn;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.actionAsUserX;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
public class FeedResourceTests extends IntegrationTestSupport {

    @SpyBean
    private FeedService feedService;

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

    @Test
    public void shouldValidatePatchRequest() throws Exception {
        mockMvc.perform(actionAsUserX(HttpMethod.PATCH, KnownUser.ADMIN, "/api/2/feeds/18")
                .json("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("status", is(400)))
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", contains("title", "url", "url")))
                .andExpect(jsonPath("fieldErrors..message", hasItems("may not be null", "invalid syndication feed", "may not be null")));
    }

    @Rollback
    @Test
    public void shouldUpdateFeed() throws Exception {
        willReturn(true).given(feedService).valid("http://feeds.feedburner.com/javaposse");

        mockMvc.perform(actionAsUserX(HttpMethod.PATCH, KnownUser.ADMIN, "/api/2/feeds/18")
                .json("{ 'title': 'expected title', 'url': 'http://feeds.feedburner.com/javaposse' }"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("url", is("http://feeds.feedburner.com/javaposse")))
                .andExpect(jsonPath("title", is("expected title")));
    }

    @Test
    public void shouldReturnWithNotFoundWhenPatchingUnknownFeed() throws Exception {
        willReturn(true).given(feedService).valid("http://feeds.feedburner.com/javaposse");

        mockMvc.perform(actionAsUserX(HttpMethod.PATCH, KnownUser.ADMIN, "/api/2/feeds/999")
                .json("{ 'title': 'expected title', 'url': 'http://feeds.feedburner.com/javaposse' }"));
    }
}