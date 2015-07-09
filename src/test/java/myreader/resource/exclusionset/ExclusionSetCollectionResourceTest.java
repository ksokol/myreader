package myreader.resource.exclusionset;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser3;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser4;
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
        mockMvc.perform(getAsUser3("/exclusions"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/exclusionset/user3.json"));
    }

    @Test
    public void testCollectionResourceForUser2JsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser4("/exclusions"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/exclusionset/user4.json"));
    }
}
