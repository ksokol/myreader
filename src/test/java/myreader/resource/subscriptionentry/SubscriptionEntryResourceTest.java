package myreader.resource.subscriptionentry;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryResourceTest extends IntegrationTestSupport {

    @Test
    public void testEntityResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscriptionentry/subscriptionEntries#4.json"));

    }

    @Test
    public void testEntityNotFound() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptionEntries/1001"))
                .andExpect(status().isNotFound());

    }

}
