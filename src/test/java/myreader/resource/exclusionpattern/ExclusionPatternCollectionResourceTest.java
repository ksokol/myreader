package myreader.resource.exclusionpattern;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.postAsUser2;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class ExclusionPatternCollectionResourceTest extends IntegrationTestSupport {

    @Test
    public void testCollectionResourceForUser1JsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser1("/api/2/exclusions/1/pattern"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/exclusionpattern/1.json"));
    }

    @Test
    public void testCollectionResourceForUser2NotFound() throws Exception {
        mockMvc.perform(getAsUser2("/api/2/exclusions/1/pattern"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testPost() throws Exception {
        mockMvc.perform(postAsUser2("/api/2/exclusions/9/pattern")
                .json("{'pattern':'test'}"))
                .andExpect(jsonEquals("json/exclusionpattern/post-9-response.json"))
                .andExpect(status().isOk());

        mockMvc.perform(getAsUser2("/api/2/exclusions/9/pattern"))
                .andExpect(jsonEquals("json/exclusionpattern/9#pattern.json"))
                .andExpect(status().isOk());
    }

    @Test
    public void testPostInvalidEmptyPattern() throws Exception {
        mockMvc.perform(postAsUser2("/api/2/exclusions/9/pattern")
                .json("{'pattern':''}"))
                .andExpect(jsonEquals("json/exclusionpattern/post-invalid-exclusionpattern.json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testPostInvalidNullPattern() throws Exception {
        mockMvc.perform(postAsUser2("/api/2/exclusions/9/pattern")
                .json("{'pattern': null}"))
                .andExpect(jsonEquals("json/exclusionpattern/post-invalid-exclusionpattern.json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testPostInvalidPattern() throws Exception {
        mockMvc.perform(postAsUser2("/api/2/exclusions/9/pattern")
                .json("{'pattern':'\\\\k'}"))
                .andExpect(jsonEquals("json/exclusionpattern/post-invalid-exclusionpattern.json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testPostDuplicate() throws Exception {
        mockMvc.perform(getAsUser2("/api/2/exclusions/6/pattern"))
                .andExpect(jsonEquals("json/exclusionpattern/6#pattern.json"));

        mockMvc.perform(postAsUser2("/api/2/exclusions/6/pattern")
                .json("{'pattern':'user2_subscription1_pattern1'}"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/exclusionpattern/post-6#pattern-response.json"));

        mockMvc.perform(getAsUser2("/api/2/exclusions/6/pattern"))
                .andExpect(jsonEquals("json/exclusionpattern/6#pattern.json"));
    }
}
