package myreader.resource.subscriptionentry;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.emptyIterable;
import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser4;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser1;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryCollectionResourceTest extends IntegrationTestSupport {

    @Test
    public void testCollectionResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionEntries"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/structure.json"));
    }

    @Test
    public void testSearchSubscriptionEntryByTitle() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionEntries?q=mysql"))
                .andExpect(status().isOk())
				.andExpect(jsonEquals("json/subscriptionentry/q#mysql.json"));
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
                .andExpect(jsonEquals("json/subscriptionentry/tag.json"));
    }

    @Test
    public void searchSubscriptionEntryTag() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntries/tag?q=help"))
                .andExpect(jsonEquals("json/subscriptionentry/tag?q=help.json"));
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

    @Test
    public void testSearchPagingStart() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntries?size=1&q=l*"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?q=l*&next=1010&size=1"))))
                .andExpect(jsonPath("content[0].links[?(@.rel=='self')].href", contains(endsWith("/1013"))));
    }

    @Test
    public void testSearchPagingMiddle() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntries?q=*&size=1&next=1012"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?q=*&next=1011&size=1"))))
                .andExpect(jsonPath("content[0].links[?(@.rel=='self')].href", contains(endsWith("/1012"))));
    }

    @Test
    public void testSearchPagingEnd() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntries?q=l*&size=1&next=1010"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("links[?(@.rel=='next')].href", emptyIterable()))
                .andExpect(jsonPath("content[0].links[?(@.rel=='self')].href", contains(endsWith("/1010"))));
    }

    @Test
    public void testBatchPatchEmptyRequestBody() throws Exception {
        mockMvc.perform(patchAsUser1("/subscriptionEntries")
                .json("{ 'content' : [] }"))
                .andExpect(jsonPath("content", emptyIterable()));
    }

    @Test
    public void testBatchPatch() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionEntries"))
                .andExpect(jsonEquals("json/subscriptionentry/structure.json"));

        mockMvc.perform(patchAsUser1("/subscriptionEntries")
                .json("{ 'content': [{ 'uuid': '1002', 'seen': false }, { 'uuid': '1001', 'tag': '1001tag' }]}"))
                .andExpect(jsonEquals("json/subscriptionentry/patch-batch-response.json"));
    }

    @Test
    public void testBatchPatchOwnedByDifferentUser() throws Exception {
        mockMvc.perform(patchAsUser1("/subscriptionEntries")
                .json("{ 'content': [{'uuid': '1003', 'seen': true}] }"))
                .andExpect(jsonPath("content", emptyIterable()));
    }

    @Test
    public void testBatchPatchValidation() throws Exception {
        mockMvc.perform(patchAsUser1("/subscriptionEntries")
                .json("{'content':[{'uuid': 'digits-only'}]}"))
                .andExpect(jsonEquals("json/subscriptionentry/patch-batch-validation-response.json"))
                .andExpect(status().isBadRequest());
    }
}
