package myreader.resource.subscriptionentry;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser2;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryResourceTest extends IntegrationTestSupport {

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
        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(content().isJsonEqual("subscriptionentry/subscriptionEntries#4.json"));

        mockMvc.perform(patchAsUser2("/subscriptionEntries/1004")
                .json("{'seen':true}"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscriptionentry/patch1-subscriptionEntries#4.json"));

        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscriptionentry/patch1-subscriptionEntries#4.json"));
    }

    @Test
    public void testPatchTag() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscriptionentry/subscriptionEntries#4.json"));

        mockMvc.perform(patchAsUser2("/subscriptionEntries/1004")
                .json("{'tag':'tag-patched'}"))
                .andExpect(content().isJsonEqual("subscriptionentry/patch2-subscriptionEntries#4.json"));

        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscriptionentry/patch2-subscriptionEntries#4.json"));
    }

}
