package myreader.resource;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

/**
 * @author Kamill Sokol
 */
public class ResourcesTest extends IntegrationTestSupport {

    @Test
    public void testResources() throws Exception {
        mockMvc.perform(getAsUser1("/"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("resources.json"));
    }

}
