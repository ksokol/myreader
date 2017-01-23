package myreader.resource.feed;

import myreader.fetcher.FeedParseException;
import myreader.fetcher.FeedParser;
import myreader.service.search.jobs.IndexSyncJob;
import myreader.test.annotation.WithMockUser2;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.TimeZone;

import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@TestPropertySource(properties = { "task.enabled = false" })
public class FeedCollectionResourceTests { //extends IntegrationTestSupport {

    static {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        System.setProperty("file.encoding", "UTF-8");
    }

    @Autowired
    private FeedParser feedParserMock;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IndexSyncJob indexSyncJob;

    @Before
    public void setUp() throws Exception {
        indexSyncJob.work();
    }

    @Test
    @WithMockUser2
    public void emptyUrl() throws Exception {
        mockMvc.perform(post("/api/2/feeds/probe")
                .with(jsonBody("{}")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("status", is(400)))
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", contains("url", "url")))
                .andExpect(jsonPath("fieldErrors..message", hasItems("invalid syndication feed", "may not be null")));
    }

    @Test
    @WithMockUser2
    public void notHttpOrHttps() throws Exception {
        mockMvc.perform(post("/api/2/feeds/probe")
                .with(jsonBody("{ 'url': 'containts no http' }")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("status", is(400)))
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", contains("url")))
                .andExpect(jsonPath("fieldErrors..message", hasItems("must begin with http(s)://")));
    }

    @Test
    @WithMockUser2
    public void notASyndicationFeed() throws Exception {
        String url = "http://duckduckgo.com";
        when(feedParserMock.parse(url)).thenThrow(new FeedParseException());

        mockMvc.perform(post("/api/2/feeds/probe")
                .with(jsonBody("{ 'url': '" + url + "' }")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("status", is(400)))
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", contains("url")))
                .andExpect(jsonPath("fieldErrors..message", hasItems("invalid syndication feed")));
    }

    @Test
    @WithMockUser2
    public void isASyndicationFeed() throws Exception {
        String url = "http://duckduckgo.com";
        when(feedParserMock.parse(url)).thenReturn(null);

        mockMvc.perform(post("/api/2/feeds/probe")
                .with(jsonBody("{ 'url': '" + url + "' }")))
                .andExpect(status().isOk());
    }

    @Test
    public void testCollectionResource() throws Exception {
        mockMvc.perform(getAsUser2("/api/2/feeds"))
                .andExpect(jsonEquals("json/feeds/getResponse.json"));
    }

}
