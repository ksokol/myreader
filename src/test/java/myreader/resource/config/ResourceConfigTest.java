package myreader.resource.config;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser1;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
public class ResourceConfigTest extends IntegrationTestSupport {

    @Test
    public void testPatchableProperties2() throws Exception {
        mockMvc.perform(patchAsUser1("/subscriptions/1")
                .json("{'links': null}"))
                .andExpect(status().isOk());
    }
}
