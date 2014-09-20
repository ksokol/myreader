package myreader.resource.exclusionpattern;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser3;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.postAsUser2;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
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

    @Test
    public void testPost() throws Exception {
        mockMvc.perform(postAsUser2("/exclusions/9/pattern")
                .json("{'pattern':'test'}"))
                .andExpect(content().isJsonEqual("exclusionpattern/post-exclusionpattern#9-response.json"))
                .andExpect(status().isOk());

        mockMvc.perform(getAsUser2("/exclusions/9/pattern"))
                .andExpect(content().isJsonEqual("exclusionpattern/exclusionpattern#9pattern.json"))
                .andExpect(status().isOk());
    }

    @Test
    public void testPostInvalidEmptyPattern() throws Exception {
        mockMvc.perform(postAsUser2("/exclusions/9/pattern")
                .json("{'pattern':''}"))
                .andExpect(content().isJsonEqual("exclusionpattern/post-invalid-exclusionpattern.json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testPostInvalidNullPattern() throws Exception {
        mockMvc.perform(postAsUser2("/exclusions/9/pattern")
                .json("{'pattern': null}"))
                .andExpect(content().isJsonEqual("exclusionpattern/post-invalid-exclusionpattern.json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testPostInvalidPattern() throws Exception {
        mockMvc.perform(postAsUser2("/exclusions/9/pattern")
                .json("{'pattern':'\\\\k'}"))
                .andExpect(content().isJsonEqual("exclusionpattern/post-invalid-exclusionpattern.json"))
                .andExpect(status().isBadRequest());
    }
}
