package myreader.resource.subscriptionentrytaggroup;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser4;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

import myreader.test.IntegrationTestSupport;

import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryTagGroupEntityResourceTest extends IntegrationTestSupport {

    @Test
    public void test() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntryTagGroups/tag1"))
                .andExpect(content().isJsonEqual("subscriptionentrytaggroup/subscriptionentrytaggroup#tag1.json"));
    }

    @Test
    public void test2() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntryTagGroups/tag2-tag3"))
                .andExpect(content().isJsonEqual("subscriptionentrytaggroup/subscriptionentrytaggroup#tag2-tag3.json"));
    }

    @Test
    public void test3() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntryTagGroups/tag4"))
                .andExpect(content().isJsonEqual("subscriptionentrytaggroup/subscriptionentrytaggroup#tag4.json"));
    }

    @Test
    public void test4() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntryTagGroups/tag5"))
                .andExpect(content().isJsonEqual("subscriptionentrytaggroup/subscriptionentrytaggroup#tag5.json"));
    }

    @Test
    public void test5() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntryTagGroups/tag6"))
                .andExpect(content().isJsonEqual("subscriptionentrytaggroup/subscriptionentrytaggroup#tag6.json"));
    }

    @Test
    public void test6() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntryTagGroups/tag7"))
                .andExpect(content().isJsonEqual("subscriptionentrytaggroup/subscriptionentrytaggroup#tag7.json"));
    }

    @Test
    public void test7() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntryTagGroups/tag8Tag9"))
                .andExpect(content().isJsonEqual("subscriptionentrytaggroup/subscriptionentrytaggroup#tag8Tag9.json"));
    }
}
