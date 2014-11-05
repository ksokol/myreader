package myreader.resource.subscriptionentry;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.emptyIterable;
import static org.hamcrest.Matchers.endsWith;
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
                .andExpect(jsonEquals("subscriptionentry/structure.json"));
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

    @Test
    public void testPagingStart() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntries?size=1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?next=1012&size=1"))))
                .andExpect(jsonPath("content[0].links[?(@.rel=='self')].href", contains(endsWith("/1013"))));
    }

    @Test
    public void testPagingMiddle() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntries?size=1&next=1012"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?next=1011&size=1"))))
                .andExpect(jsonPath("content[0].links[?(@.rel=='self')].href", contains(endsWith("/1012"))));
    }

    @Test
    public void testPagingEnd() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntries?size=1&next=1009"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("links[?(@.rel=='next')]", emptyIterable()))
                .andExpect(jsonPath("content[0].links[?(@.rel=='self')].href", contains(endsWith("/1009"))));
    }

}
