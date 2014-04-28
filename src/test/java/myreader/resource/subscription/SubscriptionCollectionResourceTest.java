package myreader.resource.subscription;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.postAsUser2;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

/**
 * @author Kamill Sokol
 */
public class SubscriptionCollectionResourceTest extends IntegrationTestSupport {

    @Test
    public void testEntityResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscription/subscriptions.json"));
    }

    @Test
    public void testFieldErrorWhenUrlIsEmpty() throws Exception {
        mockMvc.perform(postAsUser2("/subscriptions")
                .json("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().isJsonEqual("subscription/post-empty-url.json"));
    }

    @Test
    public void testFieldErrorWhenUrlHasInvalidPattern() throws Exception {
        mockMvc.perform(postAsUser2("/subscriptions")
                .json("{'url':'invalid url'}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().isJsonEqual("subscription/post-invalid-url.json"));
    }

    @Test
    public void testFieldErrorWhenPostingExistentSubscription() throws Exception {
        mockMvc.perform(postAsUser2("/subscriptions")
                .json("subscription/post-duplicate-request.json"))
                .andExpect(status().isBadRequest())
                .andExpect(content().isJsonEqual("subscription/post-duplicate-response.json"));
    }

    @Test
    public void testSuccessWhenPostingNewSubscription() throws Exception {
        mockMvc.perform(postAsUser2("/subscriptions")
                .json("subscription/post-new-request.json"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscription/post-new-response.json"));
    }
}
