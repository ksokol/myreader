package myreader.resource.user;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsAdmin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public class UserCollectionResourceTest extends IntegrationTestSupport {

    @Test
    public void givenAdminIsAuthenticated_whenCallsCollectionResource_thenAllThreeUsersShouldBeReturned() throws Exception {
       mockMvc.perform(getAsAdmin("/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.totalElements", is(3)));
    }

    @Test
    public void givenUser1IsAuthenticated_whenCallsCollectionResource_thenOnlyUser1ShouldBeReturned() throws Exception {
        mockMvc.perform(getAsUser1("/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.totalElements", is(1)));
    }

    @Test
    public void testCollectionResourceJsonStructureEquality() throws Exception {
       mockMvc.perform(getAsUser1("/users"))
               .andExpect(status().isOk())
               .andExpect(content().isJsonEqual("user/users.json"));
    }

    @Test
    public void testCollectionResourceJsonEquality() throws Exception {
        mockMvc.perform(getAsUser1("/users"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("user/users.json"));
    }
}
