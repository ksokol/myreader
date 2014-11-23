package myreader.resource.subscriptionentrytaggroup;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser4;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryTagGroupCollectionResourceTest extends IntegrationTestSupport {

    @Test
    public void testSubscriptionEntryTagGroupResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntryTagGroups"))
                .andExpect(jsonEquals("json/subscriptionentrytaggroup/structure.json"));
    }
}
