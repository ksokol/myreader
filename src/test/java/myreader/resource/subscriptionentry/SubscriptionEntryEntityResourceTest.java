package myreader.resource.subscriptionentry;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser4;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser2;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.test.IntegrationTestSupport;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.solr.core.SolrOperations;
import org.springframework.data.solr.core.query.SimpleQuery;

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
                .andExpect(content().isJsonEqual("subscriptionentry/subscriptionEntries#4.json"));
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
                .andExpect(content().isJsonEqual("subscriptionentry/subscriptionEntries#4.json"));

        mockMvc.perform(patchAsUser2("/subscriptionEntries/1004")
                .json("{'seen':false}"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscriptionentry/patch1-subscriptionEntries#4.json"));

        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscriptionentry/patch1-subscriptionEntries#4.json"));

        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscriptionentry/patch1-subscriptionEntries#4.json"));

        SearchableSubscriptionEntry after = solrOperations.queryForObject(new SimpleQuery("id:1004"), SearchableSubscriptionEntry.class);
        assertThat(after.isSeen(), is(false));
    }

    @Test
    public void testPatchTag() throws Exception {
        SearchableSubscriptionEntry before = solrOperations.queryForObject(new SimpleQuery("id:1004"), SearchableSubscriptionEntry.class);
        assertThat(before.getTag(), is("tag3"));

        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscriptionentry/subscriptionEntries#4.json"));

        mockMvc.perform(patchAsUser2("/subscriptionEntries/1004")
                .json("{'tag':'tag-patched'}"))
                .andExpect(content().isJsonEqual("subscriptionentry/patch2-subscriptionEntries#4.json"));

        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscriptionentry/patch2-subscriptionEntries#4.json"));

        SearchableSubscriptionEntry after = solrOperations.queryForObject(new SimpleQuery("id:1004"), SearchableSubscriptionEntry.class);
        assertThat(after.getTag(), is("tag-patched"));
    }

    @Test
    public void testTag1() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntries/tag/tag1"))
                .andExpect(content().isJsonEqual("subscriptionentry/tag1.json"));
    }

    @Test
    public void testTag2tag3() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntries/tag/tag2-tag3"))
                .andExpect(content().isJsonEqual("subscriptionentry/tag2-tag3.json"));
    }

    @Test
    public void testTag4() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntries/tag/tag4"))
                .andExpect(content().isJsonEqual("subscriptionentry/tag4.json"));
    }

    @Test
    public void testTag5() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntries/tag/tag5"))
                .andExpect(content().isJsonEqual("subscriptionentry/tag5.json"));
    }

    @Test
    public void testTag6() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntries/tag/tag6"))
                .andExpect(content().isJsonEqual("subscriptionentry/tag6.json"));
    }

    @Test
    public void testTag7() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntries/tag/tag7"))
                .andExpect(content().isJsonEqual("subscriptionentry/tag7.json"));
    }

    @Test
    public void testTag8tag9() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntries/tag/tag8Tag9"))
                .andExpect(content().isJsonEqual("subscriptionentry/tag8Tag9.json"));
    }

    @Test
    public void testSearch() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionEntries/tag/tag1?q=time"))
                .andExpect(content().isJsonEqual("subscriptionentry/tag1?q=time.json"));
    }
}