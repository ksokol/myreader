package myreader.resource.subscriptionentrytaggroup;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser4;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

import myreader.test.IntegrationTestSupport;

import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryTagGroupCollectionResourceTest extends IntegrationTestSupport {

    @Test
    public void testSubscriptionEntryTagGroupResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntryTagGroups"))
                .andExpect(content().isJsonEqual("subscriptionentrytaggroup/structure-subscriptionentrytaggroup.json"));
    }
}
