package myreader.resource.subscriptionentry;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryCollectionResourceTest extends IntegrationTestSupport {

    @Test
    public void testCollectionResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionEntries"))
                .andDo(print())
                .andExpect(content().isJsonEqual("subscriptionentry/subscriptionEntries.json"));
    }

    @Test
    public void testFindBySubscription() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptionEntries/search/findBySubscription/8"))
                .andDo(print())
                .andExpect(content().isJsonEqual("subscriptionentry/subscriptionEntries#search#findBySubscription#8.json"));
    }

}
