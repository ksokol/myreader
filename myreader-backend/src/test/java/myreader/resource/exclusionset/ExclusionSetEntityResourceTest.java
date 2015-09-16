package myreader.resource.exclusionset;

import static myreader.test.KnownUser.USER113;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.actionAsUserX;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser3;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class ExclusionSetEntityResourceTest extends IntegrationTestSupport {

    @Test
    public void testCollectionEntityForUser2JsonStructureEquality() throws Exception {
        mockMvc.perform(actionAsUserX(GET, USER113,"/api/2/exclusions/1101"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/exclusionset/user113#1101.json"));
    }

    @Test
    public void testCollectionEntityForNotFoundForUser3() throws Exception {
        mockMvc.perform(getAsUser3("/api/2/exclusions/6"))
                .andExpect(status().isNotFound());
    }
}
