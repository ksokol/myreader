package myreader.resource.exclusionpattern;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

import myreader.test.IntegrationTestSupport;

import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class ExclusionPatternCollectionResourceTest extends IntegrationTestSupport {

    @Test
    public void testCollectionResourceForUser1JsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser1("/exclusions/1/pattern"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("exclusionpattern/exclusionpattern#1.json"));
    }

    @Test
    public void testCollectionResourceForUser2NotFound() throws Exception {
        mockMvc.perform(getAsUser2("/exclusions/1/pattern"))
                .andExpect(status().isNotFound());
    }
}
