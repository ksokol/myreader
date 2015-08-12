package myreader.resource.exclusionpattern;

import static myreader.test.KnownUser.USER113;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.actionAsUserX;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.deleteAsUser1;
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
        mockMvc.perform(actionAsUserX(GET, USER113, "/api/2/exclusions/1101/pattern/7"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/exclusionpattern/1101#pattern#7.json"));
    }

    @Test
    public void testEntityResourceForUser2NotFound() throws Exception {
        mockMvc.perform(getAsUser2("/api/2/exclusions/1/pattern/0"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testDelete() throws Exception {
        testEntityResourceForUser1JsonStructureEquality();

        mockMvc.perform(deleteAsUser1("/api/2/exclusions/1/pattern/0"))
                .andExpect(status().isOk());

        mockMvc.perform(getAsUser1("/api/2/exclusions/1/pattern/0"))
                .andExpect(status().isNotFound());
    }
}
