package myreader.resource.subscriptionentry;

import com.jayway.jsonpath.JsonPath;
import myreader.entity.SubscriptionEntry;
import myreader.test.TestConstants;
import myreader.test.TestProperties;
import org.hibernate.search.jpa.Search;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import javax.persistence.EntityManager;
import java.io.IOException;
import java.util.List;
import java.util.TimeZone;

import static myreader.test.CustomMockMvcResultMatchers.validation;
import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.hamcrest.Matchers.empty;
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
@Transactional(propagation = Propagation.SUPPORTS)
public class SubscriptionEntryCollectionResourceTests {

    static {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    @DynamicPropertySource
    static void withProperties(DynamicPropertyRegistry registry) {
        TestProperties.withProperties(registry);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EntityManager em;

    @Autowired
    private TransactionTemplate tx;

    @Before
    public void setUp() {
        tx.execute(s -> {
            try {
                Search.getFullTextEntityManager(em).createIndexer().startAndWait();
            } catch (InterruptedException exception) {
                throw new AssertionError(exception);
            }
            return null;
        });
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void shouldReturnExpectedJsonStructure() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries?size=2&page=1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.links[0].rel", is("self")))
                .andExpect(jsonPath("$.links[0].href", endsWith("/api/2/subscriptionEntries?size=2&page=1")))
                .andExpect(jsonPath("$.links[1].rel", is("next")))
                .andExpect(jsonPath("$.links[1].href", endsWith("/api/2/subscriptionEntries?size=2&page=1&next=1012")))
                .andExpect(jsonPath("$.content[0].uuid", is("1013")))
                .andExpect(jsonPath("$.content[0].title", is("Livelocks from wait/notify")))
                .andExpect(jsonPath("$.content[0].feedTitle", is("user4_subscription1")))
                .andExpect(jsonPath("$.content[0].tag", is("tag8Tag9")))
                .andExpect(jsonPath("$.content[0].content", is("content")))
                .andExpect(jsonPath("$.content[0].seen", is(false)))
                .andExpect(jsonPath("$.content[0].feedTag", nullValue()))
                .andExpect(jsonPath("$.content[0].feedTagColor", nullValue()))
                .andExpect(jsonPath("$.content[0].feedUuid", is("14")))
                .andExpect(jsonPath("$.content[0].origin", is("http://www.javaspecialists.eu/archive/Issue213.html")))
                .andExpect(jsonPath("$.content[0].createdAt", is("2011-04-15T19:20:46.000+0000")))
                .andExpect(jsonPath("$.content[1].uuid", is("1012")))
                .andExpect(jsonPath("$.content[1].title", is("Throwing Exceptions from Fields")))
                .andExpect(jsonPath("$.content[1].feedTitle", is("user4_subscription1")))
                .andExpect(jsonPath("$.content[1].tag", is("tag6,tag7")))
                .andExpect(jsonPath("$.content[1].content", is("content")))
                .andExpect(jsonPath("$.content[1].seen", is(false)))
                .andExpect(jsonPath("$.content[1].feedTag", nullValue()))
                .andExpect(jsonPath("$.content[1].feedTagColor", nullValue()))
                .andExpect(jsonPath("$.content[1].feedUuid", is("14")))
                .andExpect(jsonPath("$.content[1].origin", is("http://www.javaspecialists.eu/archive/Issue208.html")))
                .andExpect(jsonPath("$.content[1].createdAt", is("2011-04-15T19:20:46.000+0000")))
                .andExpect(jsonPath("$.page", nullValue()));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void shouldPaginate() throws Exception {
        MvcResult firstResponse = mockMvc.perform(get("/api/2/subscriptionEntries?size=2"))
                .andExpect(jsonPath("content[0].uuid", is("1013")))
                .andExpect(jsonPath("content[1].uuid", is("1012")))
                .andReturn();

        MvcResult secondResponse = mockMvc.perform(get(nextPage(firstResponse)))
                .andExpect(jsonPath("content[0].uuid", is("1011")))
                .andExpect(jsonPath("content[1].uuid", is("1010")))
                .andReturn();

        mockMvc.perform(get(nextPage(secondResponse)))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", is(empty())))
                .andExpect(jsonPath("content[0].uuid", is("1009")));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void shouldPaginateWithSearch() throws Exception {
        MvcResult firstResponse = mockMvc.perform(get("/api/2/subscriptionEntries?q=l*&size=1"))
                .andExpect(jsonPath("content[0].uuid", is("1013")))
                .andReturn();

        mockMvc.perform(get(nextPage(firstResponse)))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", is(empty())))
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
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    @WithMockUser(TestConstants.USER108)
    public void shouldPatchSeenAndTagInMultipleEntries() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries"))
                .andExpect(jsonPath("content[0].tag", is("tag3")))
                .andExpect(jsonPath("content[1].tag", is("tag3")))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].seen", is(true)));

        tx.execute(s -> {
            try {
                mockMvc.perform(patch("/api/2/subscriptionEntries")
                        .with(jsonBody("{'content': [{'uuid': '1018', 'seen': false}, {'uuid': '1019', 'tag': '1001tag'}]}")))
                        .andExpect(jsonPath("content[0].tag", nullValue()))
                        .andExpect(jsonPath("content[1].tag", is("1001tag")))
                        .andExpect(jsonPath("content[0].seen", is(false)))
                        .andExpect(jsonPath("content[1].seen", is(false)));
            } catch (Exception exception) {
                throw new AssertionError(exception);
            }
            return null;
        });
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    @WithMockUser(TestConstants.USER107)
    public void shouldNotPatchEntries() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries"))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].seen", is(true)));

        tx.execute(s -> {
            try {
                mockMvc.perform(patch("/api/2/subscriptionEntries")
                        .with(jsonBody("{'content': [{'uuid': '1016', 'seen': false}, {'uuid': '1017', 'seen': true}]}")))
                        .andExpect(jsonPath("content[0].seen", is(false)))
                        .andExpect(jsonPath("content[1].seen", is(true)));
            } catch (Exception exception) {
                throw new AssertionError(exception);
            }
            return null;
        });
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    @WithMockUser(TestConstants.USER109)
    public void shouldPatchSeenInMultipleEntriesCastingStringValueToBoolean() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries"))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].seen", is(true)));

        tx.execute(s -> {
            try {
                mockMvc.perform(patch("/api/2/subscriptionEntries")
                        .with(jsonBody("{'content': [{'uuid': '1020', 'seen': true}, {'uuid': '1021', 'seen': 'false'}]}")))
                        .andExpect(jsonPath("content[0].seen", is(true)))
                        .andExpect(jsonPath("content[1].seen", is(false)));
            } catch (Exception exception) {
                throw new AssertionError(exception);
            }
            return null;
        });
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
                .andExpect(validation().onField("content[0].uuid", is("numeric value out of bounds (<2147483647 digits>.<0 digits> expected)")));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void shouldReturnAllEntryTags() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries/availableTags"))
                .andExpect(jsonPath("$", hasItems("tag1", "tag2-tag3", "tag4", "tag5", "tag6", "tag7", "tag8Tag9")));
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    @WithMockUser(TestConstants.USER4)
    public void shouldPaginateWithChangingSeenValues() throws Exception {
        MvcResult firstResponse = mockMvc.perform(get("/api/2/subscriptionEntries?q=*&size=2&seenEqual=false"))
                .andExpect(jsonPath("content[0].uuid", is("1013")))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].uuid", is("1012")))
                .andExpect(jsonPath("content[1].seen", is(false)))
                .andReturn();

        tx.execute(s -> {
            SubscriptionEntry subscriptionEntry = em.find(SubscriptionEntry.class, 1012L);
            subscriptionEntry.setSeen(true);
            em.persist(subscriptionEntry);
            em.flush();
            return null;
        });

        mockMvc.perform(get("/api/2/subscriptionEntries?q=*&size=10"))
                .andExpect(jsonPath("content[0].uuid", is("1013")))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].uuid", is("1012")))
                .andExpect(jsonPath("content[1].seen", is(true)))
                .andExpect(jsonPath("content[2].uuid", is("1011")))
                .andExpect(jsonPath("content[2].seen", is(false)))
                .andExpect(jsonPath("content[3].uuid", is("1010")))
                .andExpect(jsonPath("content[3].seen", is(false)))
                .andExpect(jsonPath("content[4].uuid", is("1009")))
                .andExpect(jsonPath("content[4].seen", is(false)));

        MvcResult secondResponse = mockMvc.perform(get(nextPage(firstResponse)))
                .andExpect(jsonPath("content[0].uuid", is("1011")))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].uuid", is("1010")))
                .andExpect(jsonPath("content[1].seen", is(false)))
                .andReturn();

        tx.execute(s -> {
            SubscriptionEntry subscriptionEntry = em.find(SubscriptionEntry.class, 1010L);
            subscriptionEntry.setSeen(true);
            em.persist(subscriptionEntry);
            em.flush();
            return null;
        });

        mockMvc.perform(get("/api/2/subscriptionEntries?q=*&size=10"))
                .andExpect(jsonPath("content[0].uuid", is("1013")))
                .andExpect(jsonPath("content[0].seen", is(false)))
                .andExpect(jsonPath("content[1].uuid", is("1012")))
                .andExpect(jsonPath("content[1].seen", is(true)))
                .andExpect(jsonPath("content[2].uuid", is("1011")))
                .andExpect(jsonPath("content[2].seen", is(false)))
                .andExpect(jsonPath("content[3].uuid", is("1010")))
                .andExpect(jsonPath("content[3].seen", is(true)))
                .andExpect(jsonPath("content[4].uuid", is("1009")))
                .andExpect(jsonPath("content[4].seen", is(false)));

        mockMvc.perform(get(nextPage(secondResponse)))
                .andExpect(jsonPath("links[?(@.rel=='next')].href", is(empty())))
                .andExpect(jsonPath("content[0].uuid", is("1009")))
                .andExpect(jsonPath("content[0].seen", is(false)));
    }

    private String nextPage(MvcResult mvcResult) throws IOException {
        List<String> nextHrefs = JsonPath.read(mvcResult.getResponse().getContentAsString(), "$.links[?(@.rel=='next')].href");
        if (nextHrefs.size() == 0) {
            throw new AssertionError("href with rel next not found");
        }
        return nextHrefs.get(0);
    }

}
