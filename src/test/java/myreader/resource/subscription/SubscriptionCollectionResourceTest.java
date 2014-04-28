package myreader.resource.subscription;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.test.web.servlet.MvcResult;

import static net.javacrumbs.jsonunit.JsonAssert.assertJsonEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.postAsUser2;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
public class SubscriptionCollectionResourceTest extends IntegrationTestSupport {

    @Test
    public void testEntityResourceJsonStructureEquality() throws Exception {
        MvcResult mvcResult = mockMvc.perform(getAsUser2("/subscriptions"))
                .andExpect(status().isOk())
                .andReturn();

        assertJsonEquals(jsonFromFile("subscription/subscriptions.json"), mvcResult.getResponse().getContentAsString());
    }

    @Test
    public void testFieldErrorWhenUrlIsEmpty() throws Exception {
        MvcResult mvcResult = mockMvc.perform(postAsUser2("/subscriptions")
                .content("{}"))
                .andExpect(status().isBadRequest())
                .andReturn();

        assertJsonEquals(jsonFromFile("subscription/post-empty-url.json"), mvcResult.getResponse().getContentAsString());
    }

    @Test
    public void testFieldErrorWhenUrlHasInvalidPattern() throws Exception {
        MvcResult mvcResult = mockMvc.perform(postAsUser2("/subscriptions")
                .content("{\"url\":\"invalid\"}"))
                .andExpect(status().isBadRequest())
                .andReturn();

        assertJsonEquals(jsonFromFile("subscription/post-invalid-url.json"), mvcResult.getResponse().getContentAsString());
    }

    @Test
    public void testFieldErrorWhenPostingExistentSubscription() throws Exception {
        MvcResult mvcResult = mockMvc.perform(postAsUser2("/subscriptions")
                .content(jsonFromFile("subscription/post-duplicate-request.json")))
                .andExpect(status().isBadRequest())
                .andReturn();

        assertJsonEquals(jsonFromFile("subscription/post-duplicate-response.json"), mvcResult.getResponse().getContentAsString());
    }

    @Test
    public void testSuccessWhenPostingNewSubscription() throws Exception {
        MvcResult mvcResult = mockMvc.perform(postAsUser2("/subscriptions")
                .content(jsonFromFile("subscription/post-new-request.json")))
                .andExpect(status().isOk())
                .andReturn();

        assertJsonEquals(jsonFromFile("subscription/post-new-response.json"), mvcResult.getResponse().getContentAsString());
    }


}
