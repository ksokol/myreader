package myreader.resource.exclusionset;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser3;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
public class ExclusionSetEntityResourceTest extends IntegrationTestSupport {

    @Test
    public void testCollectionEntityForUser2JsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser2("/exclusions/6"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("exclusionset/user2#6.json"));
    }

    @Test
    public void testCollectionEntityForNotFoundForUser3() throws Exception {
        mockMvc.perform(getAsUser3("/exclusions/6"))
                .andExpect(status().isNotFound());
    }
}
