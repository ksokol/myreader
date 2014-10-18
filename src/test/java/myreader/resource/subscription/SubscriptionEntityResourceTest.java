package myreader.resource.subscription;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.core.Is.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.deleteAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser2;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

import myreader.service.search.jobs.IndexSyncJob;
import myreader.test.IntegrationTestSupport;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntityResourceTest extends IntegrationTestSupport {

    @Autowired
    private IndexSyncJob indexSyncJob;

    @Test
    public void testEntityResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions/1"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscription/structure-subscription#1.json"));
    }

    @Test
    public void testEntityResourceSubscriptionEntries() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions/3/entries"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscription/subscriptions#3#entries.json"));
    }

    @Test
    public void testEntityResourceSubscriptionEntriesSearch() throws Exception {
        indexSyncJob.run();

        mockMvc.perform(getAsUser1("/subscriptions/3/entries?q=party"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscription/subscriptions#3#entries#q=party.json"));
    }

    @Test
    public void testEntityResourceNewSubscriptionEntries() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions/3/entries/new"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscription/subscriptions#3#entries#new.json"));
    }

    @Test
    public void testEntityResourceSubscriptionNewEntriesSearch() throws Exception {
        indexSyncJob.run();

        mockMvc.perform(getAsUser1("/subscriptions/3/entries/new?q=party"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscription/subscriptions#3#entries#new#q=party.json"));
    }

    @Test
    public void testNotFoundWhenGetNotOwnSubscription() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions/6"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testDelete() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.totalElements", is(5)))
                .andExpect(jsonPath("$.content..links[?(@.rel=='origin')].href", hasItem("http://feeds.feedburner.com/javaposse")));

        mockMvc.perform(deleteAsUser1("/subscriptions/1"))
                .andExpect(status().isNoContent());

        mockMvc.perform(getAsUser1("/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.totalElements", is(4)))
                .andExpect(jsonPath("$.content..links[?(@.rel=='origin')].href", not(hasItem("http://feeds.feedburner.com/javaposse"))));
    }

    @Test
    public void testNotFoundWhenPatchNotOwnSubscription() throws Exception {
        mockMvc.perform(patchAsUser2("/subscriptions/1")
                .json("subscription/patchable-properties1-subscription#1.json"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testPatchableProperties() throws Exception {
        mockMvc.perform(patchAsUser1("/subscriptions/1")
                .json("subscription/patchable-properties1-subscription#1.json"))
                .andExpect(content().isJsonEqual("subscription/patchable-properties2-subscription#1.json"));
    }

    @Test
    public void testPatch() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions/1"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscription/subscription#1.json"));

        mockMvc.perform(patchAsUser1("/subscriptions/1")
                .json("{'tag':'test1'}"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscription/patch1-subscription#1.json"));

        mockMvc.perform(patchAsUser1("/subscriptions/1")
                .json("{'title':null}"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscription/patch2-subscription#1.json"));

        mockMvc.perform(patchAsUser1("/subscriptions/1")
                .json("{'title':'test2','tag':'test2'}"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscription/patch3-subscription#1.json"));

        mockMvc.perform(getAsUser1("/subscriptions/1"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscription/patch3-subscription#1.json"));
    }
}
