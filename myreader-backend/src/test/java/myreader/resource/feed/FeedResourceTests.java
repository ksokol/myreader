package myreader.resource.feed;

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
import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.is;
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
@WithMockUser(username = TestConstants.ADMIN, roles = { "ADMIN" })
@WithTestProperties
public class FeedResourceTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void shouldReturnFetchErrors() throws Exception {
        mockMvc.perform(get("/api/2/feeds/18/fetchError"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.links[0].rel", is("self")))
                .andExpect(jsonPath("$.links[0].href", endsWith("/api/2/feeds/18/fetchError?page=0&size=20")))
                .andExpect(jsonPath("$.content[0].uuid", is("1")))
                .andExpect(jsonPath("$.content[0].message", is("error message for feed 18")))
                .andExpect(jsonPath("$.content[0].createdAt", is("1970-01-01T00:00:00.000+0000")))
                .andExpect(jsonPath("$.page.totalElements", is(1)));
    }

    @Test
    public void shouldReturnFeedWithId18() throws Exception {
        mockMvc.perform(get("/api/2/feeds/18"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid", is("18")))
                .andExpect(jsonPath("$.title", is("Atlassian Blogs")))
                .andExpect(jsonPath("$.url", is("http://feeds.feedburner.com/AllAtlassianBlogs")))
                .andExpect(jsonPath("$.lastModified", is("Thu, 27 Mar 2014 13:53:36 GMT")))
                .andExpect(jsonPath("$.fetched", is(142)))
                .andExpect(jsonPath("$.hasErrors", is(true)))
                .andExpect(jsonPath("$.createdAt", is("2014-03-07T21:07:33.000+0000")));
    }

    @Test
    public void shouldReturnEmptyFeedResponseForId999() throws Exception {
        mockMvc.perform(get("/api/2/feeds/999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid", nullValue()))
                .andExpect(jsonPath("$.title", nullValue()))
                .andExpect(jsonPath("$.url", nullValue()))
                .andExpect(jsonPath("$.lastModified", nullValue()))
                .andExpect(jsonPath("$.fetched", nullValue()))
                .andExpect(jsonPath("$.hasErrors", is(false)))
                .andExpect(jsonPath("$.createdAt", nullValue()));
    }

    @Test
    public void shouldRejectDeletionWhenFeedHasSubscription() throws Exception {
        mockMvc.perform(delete("/api/2/feeds/1"))
                .andExpect(status().isConflict());
    }

    @Test
    public void shouldRejectDeletionWhenFeedDoesNotExist() throws Exception {
        mockMvc.perform(delete("/api/2/feeds/199"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void shouldDeleteFeed() throws Exception {
        mockMvc.perform(delete("/api/2/feeds/18"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void shouldValidatePatchRequest() throws Exception {
        mockMvc.perform(patch("/api/2/feeds/18")
                .with(jsonBody("{}")))
                .andExpect(status().isBadRequest())
                .andExpect(validation().onField("url", is("invalid syndication feed")))
                .andExpect(validation().onField("title", is("may not be empty")));
    }

    @Test
    public void shouldUpdateFeed() throws Exception {
        mockMvc.perform(patch( "/api/2/feeds/18")
                .with(jsonBody("{'title': 'expected title', 'url': 'http://feeds.feedburner.com/javaposse'}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("url", is("http://feeds.feedburner.com/javaposse")))
                .andExpect(jsonPath("title", is("expected title")));
    }

    @Test
    public void shouldReturnWithNotFoundWhenPatchingUnknownFeed() throws Exception {
        mockMvc.perform(patch("/api/2/feeds/999")
                .with(jsonBody("{'title': 'expected title', 'url': 'http://feeds.feedburner.com/javaposse'}")))
                .andExpect(status().isNotFound());
    }
}
