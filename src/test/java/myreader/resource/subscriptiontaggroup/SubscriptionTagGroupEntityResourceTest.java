package myreader.resource.subscriptiontaggroup;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser3;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
public class SubscriptionTagGroupEntityResourceTest extends IntegrationTestSupport {

    @Test
    public void testNotFoundException() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionTagGroups/notFound"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testSubscriptionTagGroupSubscriptions() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionTagGroups/tag1/subscriptions"))
                .andExpect(jsonEquals("subscriptiontaggroup/subscriptiontaggroups#tag1#subscriptions.json"));
    }

    @Test
    public void testSubscriptionTagGroupEntries() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptionTagGroups/tag1/entries"))
                .andExpect(jsonEquals("subscriptiontaggroup/tag1#entries.json"));
    }

    @Test
    public void testNewSubscriptionTagGroupEntries() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptionTagGroups/tag1/entries/new"))
                .andExpect(jsonEquals("subscriptiontaggroup/tag1#entries#new.json"));
    }

    @Test
    public void testSubscriptionTagGroupEntriesSearchEmptyResult() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptionTagGroups/tag3/entries?q=unknown"))
                .andExpect(jsonEquals("subscriptiontaggroup/tag3#unknown.json"));
    }

    @Test
    public void testSubscriptionTagGroupEntriesSearch() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptionTagGroups/tag1/entries?q=mysql"))
                .andExpect(jsonEquals("subscriptiontaggroup/tag1#mysql.json"));
    }

    @Test
    public void testNewSubscriptionTagGroupEntriesSearchEmptyResult() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptionTagGroups/tag3/entries/new?q=unknown"))
                .andExpect(jsonEquals("subscriptiontaggroup/tag3#new#q=unknown.json"));
    }

    @Test
    public void testNewSubscriptionTagGroupEntriesSearch() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptionTagGroups/tag1/entries/new?q=party"))
                .andExpect(jsonEquals("subscriptiontaggroup/tag1#new#q=party.json"));
    }

    @Test
    public void testSubscriptionTagGroupWithDot() throws Exception {
        mockMvc.perform(getAsUser3("/subscriptionTagGroups/tag.with.dots/subscriptions"))
                .andExpect(status().isOk());
    }

    @Test
    public void testSubscriptionTagGroupWithSlashForward() throws Exception {
        mockMvc.perform(getAsUser3("/subscriptionTagGroups/tagWith%2FForward/subscriptions"))
                .andExpect(status().isOk());
    }

}
