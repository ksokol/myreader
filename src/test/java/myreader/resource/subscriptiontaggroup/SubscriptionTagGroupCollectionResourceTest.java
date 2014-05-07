package myreader.resource.subscriptiontaggroup;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

/**
 * @author Kamill Sokol
 */
public class SubscriptionTagGroupCollectionResourceTest extends IntegrationTestSupport {

    @Test
    public void testSubscriptionTagGroups() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionTagGroups"))
                .andExpect(content().isJsonEqual("subscriptiontaggroup/subscriptiontaggroups.json"));
    }

    @Test
    public void testSubscriptionTagGroupsWithPageSize2() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionTagGroups?size=2"))
                .andExpect(content().isJsonEqual("subscriptiontaggroup/subscriptiontaggroups#size=2.json"));
    }

}
