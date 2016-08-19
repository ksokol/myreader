package myreader.resource.subscriptionentry;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;

import static myreader.test.KnownUser.USER107;
import static myreader.test.KnownUser.USER108;
import static myreader.test.KnownUser.USER109;
import static myreader.test.KnownUser.USER115;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.emptyIterable;
import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.PATCH;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.actionAsUserX;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser4;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser1;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class SubscriptionEntryCollectionResourceTest extends IntegrationTestSupport {

    @Test
    public void testCollectionResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser1("/api/2/subscriptionEntries"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/structure.json"));
    }

    @Test
    public void testSearchSubscriptionEntryByTitle() throws Exception {
        mockMvc.perform(getAsUser1("/api/2/subscriptionEntries?q=mysql"))
                .andExpect(jsonPath("content..uuid", contains("1002")));
    }

    @Test
    public void testSearchSubscriptionEntryByContent() throws Exception {
        mockMvc.perform(getAsUser1("/api/2/subscriptionEntries?q=content"))
                .andExpect(jsonPath("content", hasSize(2)));
    }

    @Test
    public void testSearchSubscriptionEntryByTag() throws Exception {
        mockMvc.perform(getAsUser1("/api/2/subscriptionEntries?q=tag1"))
                .andExpect(jsonPath("content", hasSize(2)));
    }

    @Test
    public void searchSubscriptionEntryTag() throws Exception {
        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?q=help"))
                .andExpect(jsonPath("content..uuid", contains("1011")));
    }

    @Test
    public void testPagingStart() throws Exception {
        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?size=1"))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?next=1012&size=1"))))
                .andExpect(jsonPath("content[0].uuid", is("1013")));
    }

    @Test
    public void testPagingMiddle() throws Exception {
        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?size=1&next=1012"))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?next=1011&size=1"))))
                .andExpect(jsonPath("content[0].uuid", is("1012")));
    }

    @Test
    public void testPagingEnd() throws Exception {
        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?size=1&next=1009"))
                .andExpect(jsonPath("links[?(@.rel=='next')]", emptyIterable()))
                .andExpect(jsonPath("content[0].uuid", is("1009")));
    }

    @Test
    public void testSearchPagingStart() throws Exception {
        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?size=1&q=l*"))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?q=l*&next=1010&size=1"))))
                .andExpect(jsonPath("content[0].uuid", is("1013")));
    }

    @Test
    public void testSearchPagingMiddle() throws Exception {
        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?q=*&size=1&next=1012"))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?q=*&next=1011&size=1"))))
                .andExpect(jsonPath("content[0].uuid", is("1012")));
    }

    @Test
    public void testSearchPagingEnd() throws Exception {
        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?q=l*&size=1&next=1010"))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", emptyIterable()))
                .andExpect(jsonPath("content[0].uuid", is("1010")));
    }

    @Test
    public void seenEqualFalse() throws Exception {
        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?seenEqual=false"))
                .andExpect(jsonPath("content", hasSize(5)));
    }

    @Test
    public void seenEqualTrue() throws Exception {
        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?seenEqual=true"))
                .andExpect(jsonPath("content", hasSize(0)));
    }

    @Test
    public void feedUuidEqual14() throws Exception {
        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?feedUuidEqual=14"))
                .andExpect(jsonPath("content", hasSize(5)));
    }

    @Test
    public void feedUuidEqual9114() throws Exception {
        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?feedUuidEqual=9114"))
                .andExpect(jsonPath("content", hasSize(0)));
    }

    @Test
    public void feedTagEqualUnknown() throws Exception {
        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?feedTagEqual=unknown>"))
                .andExpect(jsonPath("content", hasSize(0)));
    }

    @Test
    public void feedTagEqualTag1() throws Exception {
        mockMvc.perform(actionAsUserX(GET, USER115, "/api/2/subscriptionEntries?feedTagEqual=tag1"))
                .andExpect(jsonPath("content", hasSize(2)));
    }

    @Test
    public void entryTagEqualTag2Tag3() throws Exception {
        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?entryTagEqual=tag2"))
                .andExpect(jsonPath("content", hasSize(0)));

        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?entryTagEqual=tag2-tag3"))
                .andExpect(jsonPath("content", hasSize(1)))
                .andExpect(jsonPath("content[0].tag", is("tag2-tag3")))
                .andExpect(jsonPath("content[0].uuid", is("1010")));
    }

    @Test
    public void entryTagEqualTag4AndTag5() throws Exception {
        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?entryTagEqual=tag4"))
                .andExpect(jsonPath("content", hasSize(1)))
                .andExpect(jsonPath("content[0].tag", is("tag4 tag5")))
                .andExpect(jsonPath("content[0].uuid", is("1011")));

        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?entryTagEqual=tag5"))
                .andExpect(jsonPath("content", hasSize(1)))
                .andExpect(jsonPath("content[0].tag", is("tag4 tag5")))
                .andExpect(jsonPath("content[0].uuid", is("1011")));
    }

    @Test
    public void entryTagEqualTag6AndTag7() throws Exception {
        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?entryTagEqual=tag6"))
                .andExpect(jsonPath("content", hasSize(1)))
                .andExpect(jsonPath("content[0].tag", is("tag6,tag7")))
                .andExpect(jsonPath("content[0].uuid", is("1012")));

        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?entryTagEqual=tag7"))
                .andExpect(jsonPath("content", hasSize(1)))
                .andExpect(jsonPath("content[0].tag", is("tag6,tag7")))
                .andExpect(jsonPath("content[0].uuid", is("1012")));
    }

    @Test
    public void entryTagEqualTag8Tag9() throws Exception {
        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?entryTagEqual=tag8tag9"))
                .andExpect(jsonPath("content", hasSize(0)));

        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries?entryTagEqual=tag8Tag9"))
                .andExpect(jsonPath("content", hasSize(1)))
                .andExpect(jsonPath("content[0].uuid", is("1013")));
    }

    @Test
    public void testBatchPatchEmptyRequestBody() throws Exception {
        mockMvc.perform(patchAsUser1("/api/2/subscriptionEntries")
                .json("{ 'content' : [] }"))
                .andExpect(jsonPath("content", emptyIterable()));
    }

    @Test
    public void testBatchPatch() throws Exception {
        mockMvc.perform(actionAsUserX(GET, USER108, "/api/2/subscriptionEntries"))
                .andExpect(jsonEquals("json/subscriptionentry/user108-subscriptionEntries.json"));

        mockMvc.perform(actionAsUserX(PATCH, USER108, "/api/2/subscriptionEntries")
                .json("{ 'content': [{ 'uuid': '1018', 'seen': false }, { 'uuid': '1019', 'tag': '1001tag' }]}"))
                .andExpect(jsonPath("content[0].tag", is("tag3")))
                .andExpect(jsonPath("content[1].tag", is("1001tag")))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].seen", is(false)));
    }

    @Test
    public void testBatchPatch2() throws Exception {
        mockMvc.perform(actionAsUserX(GET, USER107, "/api/2/subscriptionEntries"))
                .andExpect(jsonEquals("json/subscriptionentry/user107-subscriptionEntries.json"));

        mockMvc.perform(actionAsUserX(PATCH, USER107, "/api/2/subscriptionEntries")
                .json("{ 'content': [{ 'uuid': '1016', 'seen': false }, { 'uuid': '1017', 'seen': 'true' }]}"))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].seen", is(true)));
    }

    @Test
    public void testBatchPatch3() throws Exception {
        mockMvc.perform(actionAsUserX(GET, USER109, "/api/2/subscriptionEntries"))
                .andExpect(jsonEquals("json/subscriptionentry/user109-subscriptionEntries.json"));

        mockMvc.perform(actionAsUserX(PATCH, USER109, "/api/2/subscriptionEntries")
                .json("{ 'content': [{ 'uuid': '1020', 'seen': false }, { 'uuid': '1021', 'seen': 'false' }]}"))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].seen", is(false)));
    }

    @Test
    public void testBatchPatchOwnedByDifferentUser() throws Exception {
        mockMvc.perform(patchAsUser1("/api/2/subscriptionEntries")
                .json("{ 'content': [{'uuid': '1003', 'seen': true}] }"))
                .andExpect(jsonPath("content", emptyIterable()));
    }

    @Test
    public void testBatchPatchValidation() throws Exception {
        mockMvc.perform(patchAsUser1("/api/2/subscriptionEntries")
                .json("{'content':[{'uuid': 'digits-only'}]}"))
                .andExpect(jsonEquals("json/subscriptionentry/patch-batch-validation-response.json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void availableTags() throws Exception {
        mockMvc.perform(getAsUser4("/api/2/subscriptionEntries/availableTags"))
        .andExpect(jsonPath("$", hasItems("tag1", "tag2-tag3", "tag4", "tag5", "tag6", "tag7", "tag8Tag9")));
    }
}
