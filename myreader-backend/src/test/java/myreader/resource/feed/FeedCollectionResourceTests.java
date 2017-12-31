package myreader.resource.feed;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;

/**
 * @author Kamill Sokol
 */
public class FeedCollectionResourceTests extends IntegrationTestSupport {

    @Test
    public void testCollectionResource() throws Exception {
        mockMvc.perform(getAsUser2("/api/2/feeds"))
                .andExpect(jsonEquals("json/feeds/getResponse.json"));
    }
}
