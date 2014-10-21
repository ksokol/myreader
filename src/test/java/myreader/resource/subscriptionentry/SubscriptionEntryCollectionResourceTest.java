package myreader.resource.subscriptionentry;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

import myreader.test.IntegrationTestSupport;

import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryCollectionResourceTest extends IntegrationTestSupport {

    @Test
    public void testCollectionResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionEntries"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscriptionentry/subscriptionEntries.json"));
    }

    @Test
    public void testSearchSubscriptionEntryByMysql() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionEntries?q=mysql"))
                .andExpect(status().isOk())
				.andExpect(content().isJsonEqual("subscriptionentry/subscriptionEntries#q#mysql.json"));
    }

}
