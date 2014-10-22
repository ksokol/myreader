package myreader.resource.subscriptionentrytaggroup;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser4;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

import myreader.test.IntegrationTestSupport;

import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryTagGroupEntityResourceTest extends IntegrationTestSupport {

    @Test
    public void testTag1() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntryTagGroups/tag1"))
                .andExpect(content().isJsonEqual("subscriptionentrytaggroup/subscriptionentrytaggroup#tag1.json"));
    }

    @Test
    public void testTag2tag3() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntryTagGroups/tag2-tag3"))
                .andExpect(content().isJsonEqual("subscriptionentrytaggroup/subscriptionentrytaggroup#tag2-tag3.json"));
    }

    @Test
    public void testTag4() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntryTagGroups/tag4"))
                .andExpect(content().isJsonEqual("subscriptionentrytaggroup/subscriptionentrytaggroup#tag4.json"));
    }

    @Test
    public void testTag5() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntryTagGroups/tag5"))
                .andExpect(content().isJsonEqual("subscriptionentrytaggroup/subscriptionentrytaggroup#tag5.json"));
    }

    @Test
    public void testTag6() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntryTagGroups/tag6"))
                .andExpect(content().isJsonEqual("subscriptionentrytaggroup/subscriptionentrytaggroup#tag6.json"));
    }

    @Test
    public void testTag7() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntryTagGroups/tag7"))
                .andExpect(content().isJsonEqual("subscriptionentrytaggroup/subscriptionentrytaggroup#tag7.json"));
    }

    @Test
    public void testTag8tag9() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntryTagGroups/tag8Tag9"))
                .andExpect(content().isJsonEqual("subscriptionentrytaggroup/subscriptionentrytaggroup#tag8Tag9.json"));
    }

    @Test
    public void testSearch() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptionEntryTagGroups/tag1?q=time"))
                .andExpect(content().isJsonEqual("subscriptionentrytaggroup/subscriptionentrytaggroup#tag1?q=time.json"));
    }
}
