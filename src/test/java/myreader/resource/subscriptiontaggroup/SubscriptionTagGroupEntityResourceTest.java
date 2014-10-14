package myreader.resource.subscriptiontaggroup;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser3;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

import myreader.service.search.jobs.IndexSyncJob;
import myreader.test.IntegrationTestSupport;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author Kamill Sokol
 */
public class SubscriptionTagGroupEntityResourceTest extends IntegrationTestSupport {

    @Autowired
    private IndexSyncJob indexSyncJob;

    @Test
    public void testSubscriptionTagGroup() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionTagGroups/tag1"))
                .andExpect(content().isJsonEqual("subscriptiontaggroup/subscriptiontaggroups#tag1.json"));
    }

    @Test
    public void testNotFoundException() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionTagGroups/notFound"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testSubscriptionTagGroupSubscriptions() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionTagGroups/tag1/subscriptions"))
                .andExpect(content().isJsonEqual("subscriptiontaggroup/subscriptiontaggroups#tag1#subscriptions.json"));
    }

    @Test
    public void testSubscriptionTagGroupEntries() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptionTagGroups/tag1/entries"))
                .andExpect(content().isJsonEqual("subscriptiontaggroup/subscriptiontaggroups#tag1#entries.json"));
    }

    @Test
    public void testSubscriptionTagGroupEntriesSearchEmptyResult() throws Exception {
        indexSyncJob.run();

        mockMvc.perform(getAsUser2("/subscriptionTagGroups/tag3/entries?q=unknown"))
                .andExpect(content().isJsonEqual("subscriptiontaggroup/subscriptiontaggroups#tag3#unknown.json"));
    }

    @Test
    public void testSubscriptionTagGroupEntriesSearch() throws Exception {
        indexSyncJob.run();

        mockMvc.perform(getAsUser2("/subscriptionTagGroups/tag1/entries?q=mysql"))
                .andExpect(content().isJsonEqual("subscriptiontaggroup/subscriptiontaggroups#tag1#mysql.json"));
    }

    @Test
    public void testSubscriptionTagGroupWithDot() throws Exception {
        mockMvc.perform(getAsUser3("/subscriptionTagGroups/tag.with.dots"))
                .andExpect(content().isJsonEqual("subscriptiontaggroup/subscriptiontaggroups#tag.with.dot.json"));
    }

    @Test
    public void testSubscriptionTagGroupWithSlashForward() throws Exception {
        mockMvc.perform(getAsUser3("/subscriptionTagGroups/tagWith%2FForward"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscriptiontaggroup/subscriptiontaggroups#tagWithSlashForward.json"));
    }

}
