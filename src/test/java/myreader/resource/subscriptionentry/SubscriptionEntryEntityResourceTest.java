package myreader.resource.subscriptionentry;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser2;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.solr.core.SolrOperations;
import org.springframework.data.solr.core.query.SimpleQuery;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.test.IntegrationTestSupport;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryEntityResourceTest extends IntegrationTestSupport {

    @Autowired
    private SolrOperations solrOperations;

    @Test
    public void testEntityResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/4.json"));
    }

    @Test
    public void testEntityNotFound() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptionEntries/1001"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testPatchSeen() throws Exception {
        SearchableSubscriptionEntry before = solrOperations.queryForObject(new SimpleQuery("id:1004"), SearchableSubscriptionEntry.class);
        assertThat(before.isSeen(), is(true));

        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/4.json"));

        mockMvc.perform(patchAsUser2("/subscriptionEntries/1004")
                .json("{'seen':false}"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/patch1#4.json"));

        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/patch1#4.json"));

        SearchableSubscriptionEntry after = solrOperations.queryForObject(new SimpleQuery("id:1004"), SearchableSubscriptionEntry.class);
        assertThat(after.isSeen(), is(false));
    }

    @Test
    public void testPatchTag() throws Exception {
        SearchableSubscriptionEntry before = solrOperations.queryForObject(new SimpleQuery("id:1004"), SearchableSubscriptionEntry.class);
        assertThat(before.getTag(), is("tag3"));

        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/4.json"));

        mockMvc.perform(patchAsUser2("/subscriptionEntries/1004")
                .json("{'tag':'tag-patched'}"))
                .andExpect(jsonEquals("json/subscriptionentry/patch2#4.json"));

        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/patch2#4.json"));

        SearchableSubscriptionEntry after = solrOperations.queryForObject(new SimpleQuery("id:1004"), SearchableSubscriptionEntry.class);
        assertThat(after.getTag(), is("tag-patched"));
    }

}
