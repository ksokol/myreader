package myreader.resource.subscriptiontaggroup;

import myreader.test.IntegrationTestSupport;
import org.junit.Ignore;
import org.junit.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

/**
 * @author Kamill Sokol
 */
public class SubscriptionTagGroupEntityResourceTest extends IntegrationTestSupport {

    @Test
    public void testSubscriptionTagGroup() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionTagGroups/tag1/subscriptions"))
                .andExpect(content().isJsonEqual("subscriptiontaggroup/subscriptiontaggroups#tag1#subscriptions.json"));
    }

    @Ignore
    @Test
    public void testSubscriptionTagGroupWithDot() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionTagGroups/tag.with.dot/subscriptions"))
                .andExpect(content().isJsonEqual("subscriptiontaggroup/subscriptiontaggroups#tag.with.dot.json"));
    }
}
