package myreader.resource.exclusionpattern;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import myreader.test.IntegrationTestSupport;

import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class ExclusionPatternEntityResourceTest extends IntegrationTestSupport {

    @Test
    public void testEntityResourceForUser1JsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser1("/exclusions/1/pattern/0"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("exclusionpattern/exclusionpattern#1pattern#0.json"));
    }

    @Test
    public void testEntityResourceForUser2NotFound() throws Exception {
        mockMvc.perform(getAsUser2("/exclusions/1/pattern/0"))
                .andExpect(status().isNotFound());
    }
}
