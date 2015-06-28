package myreader.resource.feed;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.postAsUser2;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import myreader.fetcher.FeedParseException;
import myreader.fetcher.FeedParser;
import myreader.test.IntegrationTestSupport;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author Kamill Sokol
 */
public class FeedCollectionResourceTests extends IntegrationTestSupport {

    @Autowired
    private FeedParser feedParserMock;

    @Test
    public void emptyUrl() throws Exception {
        mockMvc.perform(postAsUser2("/feeds/probe")
                .json("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("status", is(400)))
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", contains("url", "url")))
                .andExpect(jsonPath("fieldErrors..message", hasItems("invalid syndication feed", "may not be null")));
    }

    @Test
    public void notHttpOrHttps() throws Exception {
        mockMvc.perform(postAsUser2("/feeds/probe")
                .json("{ 'url': 'containts no http' }"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("status", is(400)))
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", contains("url")))
                .andExpect(jsonPath("fieldErrors..message", hasItems("must begin with http(s)://")));
    }

    @Test
    public void notASyndicationFeed() throws Exception {
        String url = "http://duckduckgo.com";
        when(feedParserMock.parse(url)).thenThrow(new FeedParseException());

        mockMvc.perform(postAsUser2("/feeds/probe")
                .json("{ 'url': '" + url + "' }"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("status", is(400)))
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", contains("url")))
                .andExpect(jsonPath("fieldErrors..message", hasItems("invalid syndication feed")));
    }

    @Test
    public void isASyndicationFeed() throws Exception {
        String url = "http://duckduckgo.com";
        when(feedParserMock.parse(url)).thenReturn(null);

        mockMvc.perform(postAsUser2("/feeds/probe")
                .json("{ 'url': '" + url + "' }"))
                .andExpect(status().isOk());
    }

}
