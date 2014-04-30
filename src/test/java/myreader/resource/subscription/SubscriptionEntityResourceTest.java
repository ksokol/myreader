package myreader.resource.subscription;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsNot.not;
import static org.junit.internal.matchers.IsCollectionContaining.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.deleteAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntityResourceTest extends IntegrationTestSupport {

    @Test
    public void testEntityResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions/1"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscription/subscription#1.json"));
    }

    @Test
    public void testNotFoundWhenAccessingNotOwnSubscription() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions/6"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testDelete() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.totalElements", is(5)))
                .andExpect(jsonPath("$.content..url", hasItem("http://feeds.feedburner.com/javaposse")));

        mockMvc.perform(deleteAsUser1("/subscriptions/1"))
                .andExpect(status().isNoContent());

        mockMvc.perform(getAsUser1("/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.totalElements", is(4)))
                .andExpect(jsonPath("$.content..url", not(hasItem("http://feeds.feedburner.com/javaposse"))));
    }
}
