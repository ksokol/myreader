package myreader.resource.resources;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import myreader.test.IntegrationTestSupport;

import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class ResourcesTest extends IntegrationTestSupport {

    @Test
    public void testResources() throws Exception {
        mockMvc.perform(getAsUser1("/"))
                .andExpect(status().isOk());
    }

}
