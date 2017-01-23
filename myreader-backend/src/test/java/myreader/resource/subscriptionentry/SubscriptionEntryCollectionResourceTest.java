package myreader.resource.subscriptionentry;

import myreader.service.search.jobs.IndexSyncJob;
import myreader.test.annotation.WithMockUser1;
import myreader.test.annotation.WithMockUser107;
import myreader.test.annotation.WithMockUser108;
import myreader.test.annotation.WithMockUser109;
import myreader.test.annotation.WithMockUser4;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.TimeZone;

import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.emptyIterable;
import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@TestPropertySource(properties = { "task.enabled = false" })
public class SubscriptionEntryCollectionResourceTest {

    static {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        System.setProperty("file.encoding", "UTF-8");
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IndexSyncJob indexSyncJob;

    @Before
    public void setUp() throws Exception {
        indexSyncJob.work();
    }

    @Test
    @WithMockUser1
    public void testCollectionResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries")
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/structure.json"));
    }

    @Test
    @WithMockUser4
    public void testPagingStart() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries?size=1")
                .contentType(APPLICATION_JSON))
                .andDo(print())
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?next=1012&size=1"))))
                .andExpect(jsonPath("content[0].uuid", is("1013")));
    }

    @Test
    @WithMockUser4
    public void testPagingMiddle() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries?size=1&next=1012")
                .contentType(APPLICATION_JSON))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?next=1011&size=1"))))
                .andExpect(jsonPath("content[0].uuid", is("1012")));
    }

    @Test
    @WithMockUser4
    public void testPagingEnd() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries?size=1&next=1009")
                .contentType(APPLICATION_JSON))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?next=1008&size=1"))))
                .andExpect(jsonPath("content[0].uuid", is("1009")));

        mockMvc.perform(get("/api/2/subscriptionEntries?size=1&next=1008"))
                .andExpect(jsonPath("content..uuid", emptyIterable()));
    }

    @Test
    @WithMockUser4
    public void testSearchPagingStart() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries?size=1&q=l*")
                .contentType(APPLICATION_JSON))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?q=l*&next=1012&size=1"))))
                .andExpect(jsonPath("content[0].uuid", is("1013")));
    }

    @Test
    @WithMockUser4
    public void testSearchPagingMiddle() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries?q=*&size=1&next=1012"))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?q=*&next=1011&size=1"))))
                .andExpect(jsonPath("content[0].uuid", is("1012")));
    }

    @Test
    @WithMockUser4
    public void testSearchPagingEnd() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries?q=l*&size=1&next=1010")
                .contentType(APPLICATION_JSON))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?q=l*&next=1009&size=1"))))
                .andExpect(jsonPath("content[0].uuid", is("1010")));
    }

    @Test
    @WithMockUser1
    public void testBatchPatchEmptyRequestBody() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionEntries")
                .with(jsonBody("{ 'content' : [] }")))
                .andExpect(jsonPath("content", emptyIterable()));
    }

    @Test
    @WithMockUser108
    public void testBatchPatch() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries")
                .contentType(APPLICATION_JSON))
                .andExpect(jsonEquals("json/subscriptionentry/user108-subscriptionEntries.json"));

        mockMvc.perform(patch("/api/2/subscriptionEntries")
                .with(jsonBody("{ 'content': [{ 'uuid': '1018', 'seen': false }, { 'uuid': '1019', 'tag': '1001tag' }]}")))
                .andExpect(jsonPath("content[0].tag", nullValue()))
                .andExpect(jsonPath("content[1].tag", is("1001tag")))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].seen", is(false)));
    }

    @Test
    @WithMockUser107
    public void testBatchPatch2() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries")
                .contentType(APPLICATION_JSON))
                .andExpect(jsonEquals("json/subscriptionentry/user107-subscriptionEntries.json"));

        mockMvc.perform(patch("/api/2/subscriptionEntries")
                .with(jsonBody("{ 'content': [{ 'uuid': '1016', 'seen': false }, { 'uuid': '1017', 'seen': 'true' }]}")))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].seen", is(true)));
    }

    @Test
    @WithMockUser109
    public void testBatchPatch3() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries")
                .contentType(APPLICATION_JSON))
                .andExpect(jsonEquals("json/subscriptionentry/user109-subscriptionEntries.json"));

        mockMvc.perform(patch("/api/2/subscriptionEntries")
                .with(jsonBody("{ 'content': [{ 'uuid': '1020', 'seen': false }, { 'uuid': '1021', 'seen': 'false' }]}")))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].seen", is(false)));
    }

    @Test
    @WithMockUser1
    public void testBatchPatchOwnedByDifferentUser() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionEntries")
                .with(jsonBody("{ 'content': [{'uuid': '1003', 'seen': true}] }")))
                .andExpect(jsonPath("content", emptyIterable()));
    }

    @Test
    @WithMockUser1
    public void testBatchPatchValidation() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionEntries")
                .with(jsonBody("{'content':[{'uuid': 'digits-only'}]}")))
                .andExpect(jsonEquals("json/subscriptionentry/patch-batch-validation-response.json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser4
    public void availableTags() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries/availableTags")
                .contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$", hasItems("tag1", "tag2-tag3", "tag4", "tag5", "tag6", "tag7", "tag8Tag9")));
    }
}
