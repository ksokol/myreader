package myreader.resource.subscriptionentry;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser4;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
                .andExpect(jsonEquals("subscriptionentry/subscriptionEntries.json"));
    }

    @Test
    public void testSearchSubscriptionEntryByTitle() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionEntries?q=mysql"))
                .andExpect(status().isOk())
				.andExpect(jsonEquals("subscriptionentry/subscriptionEntries#q#mysql.json"));
    }

    @Test
    public void testSearchSubscriptionEntryByContent() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionEntries?q=content"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("content", hasSize(2)));
    }

    @Test
    public void testSearchSubscriptionEntryByTag() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionEntries?q=tag1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("content", hasSize(2)));
    }

    @Test
    public void testSubscriptionEntryTag() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntries/tag"))
                .andExpect(jsonEquals("subscriptionentry/tag.json"));
    }

    @Test
    public void searchSubscriptionEntryTag() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntries/tag?q=help"))
                .andExpect(jsonEquals("subscriptionentry/tag?q=help.json"));

    }
}
