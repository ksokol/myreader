package myreader.resource.exclusionset;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import myreader.test.IntegrationTestSupport;

import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class ExclusionSetCollectionResourceTest extends IntegrationTestSupport {

    @Test
    public void testCollectionResourceForUser1JsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser1("/exclusions"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("exclusionset/exclusionset.user1.json"));
    }

    @Test
    public void testCollectionResourceForUser2JsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser2("/exclusions"))
                .andExpect(status().isOk())
               .andExpect(jsonEquals("exclusionset/exclusionset.user2.json"));
    }
}
