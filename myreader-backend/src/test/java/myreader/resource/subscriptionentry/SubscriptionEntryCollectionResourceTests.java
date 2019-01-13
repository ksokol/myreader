package myreader.resource.subscriptionentry;

import myreader.service.search.jobs.IndexSyncJob;
import myreader.test.TestConstants;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.TimeZone;

import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.emptyIterable;
import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@Sql("classpath:test-data.sql")
@Transactional
public class SubscriptionEntryCollectionResourceTests {

    static {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IndexSyncJob indexSyncJob;

    @Before
    public void setUp() {
        indexSyncJob.work();
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldReturnExpectedJsonStructure() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.links[0].rel", is("self")))
                .andExpect(jsonPath("$.links[0].href", endsWith("/api/2/subscriptionEntries")))
                .andExpect(jsonPath("$.content[0].uuid", is("1002")))
                .andExpect(jsonPath("$.content[0].title", is("MySQL is to SQL like ??? to NoSQL")))
                .andExpect(jsonPath("$.content[0].feedTitle", is("user1_subscription3")))
                .andExpect(jsonPath("$.content[0].tag", is("tag1")))
                .andExpect(jsonPath("$.content[0].content", is("content")))
                .andExpect(jsonPath("$.content[0].seen", is(true)))
                .andExpect(jsonPath("$.content[0].feedTag", is("tag2")))
                .andExpect(jsonPath("$.content[0].feedTagColor", nullValue()))
                .andExpect(jsonPath("$.content[0].feedUuid", is("3")))
                .andExpect(jsonPath("$.content[0].origin", is("http://Use-The-Index-Luke.com/blog/2013-10/mysql-is-to-sql-like-mongodb-to-nosql")))
                .andExpect(jsonPath("$.content[0].createdAt", is("2011-04-15T19:20:46.000+0000")))
                .andExpect(jsonPath("$.content[1].uuid", is("1001")))
                .andExpect(jsonPath("$.content[1].title", is("Party time")))
                .andExpect(jsonPath("$.content[1].feedTitle", is("user1_subscription3")))
                .andExpect(jsonPath("$.content[1].tag", is("tag1")))
                .andExpect(jsonPath("$.content[1].content", is("content")))
                .andExpect(jsonPath("$.content[1].seen", is(false)))
                .andExpect(jsonPath("$.content[1].feedTag", is("tag2")))
                .andExpect(jsonPath("$.content[1].feedTagColor", nullValue()))
                .andExpect(jsonPath("$.content[1].feedUuid", is("3")))
                .andExpect(jsonPath("$.content[1].origin", is("http://Use-The-Index-Luke.com/blog/2013-03/Party-Time")))
                .andExpect(jsonPath("$.content[1].createdAt", is("2011-04-15T19:20:46.000+0000")))
                .andExpect(jsonPath("$.page", nullValue()));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void shouldReturnFirstPage() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries?size=1"))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?next=1012&size=1"))))
                .andExpect(jsonPath("content[0].uuid", is("1013")));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void shouldReturnSecondPage() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries?size=1&next=1012"))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?next=1011&size=1"))))
                .andExpect(jsonPath("content[0].uuid", is("1012")));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void shouldReturnLastPage() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries?size=1&next=1009"))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?next=1008&size=1"))))
                .andExpect(jsonPath("content[0].uuid", is("1009")));

        mockMvc.perform(get("/api/2/subscriptionEntries?size=1&next=1008"))
                .andExpect(jsonPath("content..uuid", emptyIterable()));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void shouldReturnFirstSearchResultPage() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries?size=1&q=l*"))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?q=l*&next=1012&size=1"))))
                .andExpect(jsonPath("content[0].uuid", is("1013")));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void shouldReturnSecondSearchResultPage() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries?q=*&size=1&next=1012"))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?q=*&next=1011&size=1"))))
                .andExpect(jsonPath("content[0].uuid", is("1012")));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void shouldReturnLastSearchResultPage() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries?q=l*&size=1&next=1010"))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", contains(endsWith("?q=l*&next=1009&size=1"))))
                .andExpect(jsonPath("content[0].uuid", is("1010")));
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldDoNothingWhenPatchRequestContainsNoPatchableEntries() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionEntries")
                .with(jsonBody("{'content' : []}")))
                .andExpect(jsonPath("content", emptyIterable()));
    }

    @Test
    @WithMockUser(TestConstants.USER108)
    public void shouldPatchSeenAndTagInMultipleEntries() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries"))
                .andExpect(jsonPath("content[0].tag", is("tag3")))
                .andExpect(jsonPath("content[1].tag", is("tag3")))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].seen", is(true)));

        mockMvc.perform(patch("/api/2/subscriptionEntries")
                .with(jsonBody("{'content': [{'uuid': '1018', 'seen': false}, {'uuid': '1019', 'tag': '1001tag'}]}")))
                .andExpect(jsonPath("content[0].tag", nullValue()))
                .andExpect(jsonPath("content[1].tag", is("1001tag")))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].seen", is(false)));
    }

    @Test
    @WithMockUser(TestConstants.USER107)
    public void shouldNotPatchEntries() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries"))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].seen", is(true)));

        mockMvc.perform(patch("/api/2/subscriptionEntries")
                .with(jsonBody("{'content': [{'uuid': '1016', 'seen': false}, {'uuid': '1017', 'seen': true}]}")))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].seen", is(true)));
    }

    @Test
    @WithMockUser(TestConstants.USER109)
    public void shouldPatchSeenInMultipleEntriesCastingStringValueToBoolean() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries"))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].seen", is(true)));

        mockMvc.perform(patch("/api/2/subscriptionEntries")
                .with(jsonBody("{'content': [{'uuid': '1020', 'seen': true}, {'uuid': '1021', 'seen': 'false'}]}")))
                .andExpect(jsonPath("content[0].seen", is(true)))
                .andExpect(jsonPath("content[1].seen", is(false)));
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldNotPatchEntryWhenEntryOwnedByDifferentUser() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionEntries")
                .with(jsonBody("{'content': [{'uuid': '1003', 'seen': true}]}")))
                .andExpect(jsonPath("content", emptyIterable()));
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldRejectPatchRequestWhenUuidContainsAnInvalidValue() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionEntries")
                .with(jsonBody("{'content':[{'uuid': 'digits-only'}]}")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", contains("content[0].uuid")))
                .andExpect(jsonPath("fieldErrors..message", hasItems("numeric value out of bounds (<2147483647 digits>.<0 digits> expected)")));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void shouldReturnAllEntryTags() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries/availableTags"))
                .andExpect(jsonPath("$", hasItems("tag1", "tag2-tag3", "tag4", "tag5", "tag6", "tag7", "tag8Tag9")));
    }
}
