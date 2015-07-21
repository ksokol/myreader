package myreader.resource.user;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsAdmin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class UserEntityResourceTest extends IntegrationTestSupport {

    @Test
    public void testReadRestriction() throws Exception {
       mockMvc.perform(getAsAdmin("/api/2/users/1")).andExpect(status().isNotFound());
    }

    @Test
    public void testEntityResourceJsonStructureEquality() throws Exception {
       mockMvc.perform(getAsUser1("/api/2/users/1"))
               .andExpect(status().isOk())
               .andExpect(jsonEquals("json/user/1.json"));
    }

    @Test
    public void testEntityResourceJsonEquality() throws Exception {
        mockMvc.perform(getAsUser1("/api/2/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/user/1.json"));
    }

}
