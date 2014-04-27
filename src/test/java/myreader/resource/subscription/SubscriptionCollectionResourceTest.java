package myreader.resource.subscription;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import static net.javacrumbs.jsonunit.JsonAssert.assertJsonEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.postAsUser2;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
public class SubscriptionCollectionResourceTest extends IntegrationTestSupport {

    @Test
    public void testEntityResourceJsonStructureEquality() throws Exception {
        MvcResult mvcResult = mockMvc.perform(getAsUser2("/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andReturn();

        assertJsonEquals(jsonFromFile("subscription/subscriptions.json"), mvcResult.getResponse().getContentAsString());
    }

    @Test
    public void testFieldErrorWhenUrlIsEmpty() throws Exception {
        MvcResult mvcResult = mockMvc.perform(postAsUser2("/subscriptions")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest())
                .andReturn();

        assertJsonEquals(jsonFromFile("subscription/post-empty-url.json"), mvcResult.getResponse().getContentAsString());
    }

    @Test
    public void testFieldErrorWhenUrlHasInvalidPattern() throws Exception {
        MvcResult mvcResult = mockMvc.perform(postAsUser2("/subscriptions")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"url\":\"invalid\"}"))
                .andExpect(status().isBadRequest())
                .andReturn();

        assertJsonEquals(jsonFromFile("subscription/post-invalid-url.json"), mvcResult.getResponse().getContentAsString());
    }

}
