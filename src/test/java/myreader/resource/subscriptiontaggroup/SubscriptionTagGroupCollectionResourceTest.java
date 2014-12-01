package myreader.resource.subscriptiontaggroup;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;

/**
 * @author Kamill Sokol
 */
public class SubscriptionTagGroupCollectionResourceTest extends IntegrationTestSupport {

    @Test
    public void testSubscriptionTagGroupsJsonStructure() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionTagGroups"))
                .andExpect(jsonEquals("json/subscriptiontaggroup/structure.json"));
    }

    @Test
    public void testSubscriptionTagGroupsWithPageSize2() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionTagGroups?size=2"))
                .andExpect(jsonEquals("json/subscriptiontaggroup/size=2.json"));
    }

    @Test
    public void testNewSubscriptionTagGroups() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionTagGroups/new"))
                .andExpect(jsonEquals("json/subscriptiontaggroup/new.json"));
    }

}
