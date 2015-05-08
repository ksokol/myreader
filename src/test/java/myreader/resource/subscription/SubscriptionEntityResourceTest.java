package myreader.resource.subscription;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.deleteAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser2;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Test;

import myreader.test.IntegrationTestSupport;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntityResourceTest extends IntegrationTestSupport {

    @Test
    public void testEntityResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/structure-1.json"));
    }

    @Test
    public void testEntityResourceSubscriptionEntries() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions/3/entries"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/3#entries.json"));
    }

    @Test
    public void testEntityResourceSubscriptionEntriesSearch() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions/3/entries?q=party"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/3#entries#q=party.json"));
    }

    @Test
    public void testEntityResourceNewSubscriptionEntries() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions/3/entries/new"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/3#entries#new.json"));
    }

    @Test
    public void testEntityResourceSubscriptionNewEntriesSearch() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions/3/entries/new?q=party"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/3#entries#new#q=party.json"));
    }

    @Test
    public void testNotFoundWhenGetNotOwnSubscription() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions/6"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testDelete() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions?unseenGreaterThan=-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content..origin", hasSize(5)))
                .andExpect(jsonPath("$.content..origin", hasItem("http://feeds.feedburner.com/javaposse")));

        mockMvc.perform(deleteAsUser1("/subscriptions/1"))
                .andExpect(status().isNoContent());

        mockMvc.perform(getAsUser1("/subscriptions?unseenGreaterThan=-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content..origin", hasSize(4)))
                .andExpect(jsonPath("$.content..origin", not(hasItem("http://feeds.feedburner.com/javaposse"))));
    }

    @Test
    public void testNotFoundWhenPatchNotOwnSubscription() throws Exception {
        mockMvc.perform(patchAsUser2("/subscriptions/1")
                .json("json/subscription/patchable-properties1-1.json"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testPatchableProperties() throws Exception {
        mockMvc.perform(patchAsUser1("/subscriptions/1")
                .json("json/subscription/patchable-properties1-1.json"))
                .andExpect(jsonEquals("json/subscription/patchable-properties2-1.json"));
    }

    @Test
    public void testPatch() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/1.json"));

        mockMvc.perform(patchAsUser1("/subscriptions/1")
                .json("{'tag':'test1'}"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/patch1-1.json"));

        mockMvc.perform(patchAsUser1("/subscriptions/1")
                .json("{'title':null}"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/patch2-1.json"));

        mockMvc.perform(patchAsUser1("/subscriptions/1")
                .json("{'title':'test2','tag':'test2'}"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/patch3-1.json"));

        mockMvc.perform(getAsUser1("/subscriptions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/patch3-1.json"));
    }
}
