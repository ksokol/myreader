package myreader.resource.subscriptionentry;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser2;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.service.search.jobs.IndexSyncJob;
import myreader.test.IntegrationTestSupport;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.query.SimpleQuery;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryResourceTest extends IntegrationTestSupport {

    @Autowired
    private IndexSyncJob indexSyncJob;
    @Autowired
    private SolrTemplate solrTemplate;

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
        indexSyncJob.run();
        solrTemplate.commit();

        SearchableSubscriptionEntry before = solrTemplate.queryForObject(new SimpleQuery("id:1004"), SearchableSubscriptionEntry.class);
        assertThat(before.isSeen(), is(true));

        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andDo(print())
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

        solrTemplate.commit();
        SearchableSubscriptionEntry after = solrTemplate.queryForObject(new SimpleQuery("id:1004"), SearchableSubscriptionEntry.class);
        assertThat(after.isSeen(), is(false));
    }

    @Test
    public void testPatchTag() throws Exception {
        indexSyncJob.run();
        solrTemplate.commit();

        SearchableSubscriptionEntry before = solrTemplate.queryForObject(new SimpleQuery("id:1004"), SearchableSubscriptionEntry.class);
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

        solrTemplate.commit();
        SearchableSubscriptionEntry after = solrTemplate.queryForObject(new SimpleQuery("id:1004"), SearchableSubscriptionEntry.class);
        assertThat(after.getTag(), is("tag-patched"));
    }
}
