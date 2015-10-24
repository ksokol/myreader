package myreader.resource.user;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsAdmin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import myreader.test.IntegrationTestSupport;

import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class UserCollectionResourceTest extends IntegrationTestSupport {

    @Test
    public void givenAdminIsAuthenticatedWhenCallsCollectionResourceThenAllThreeUsersShouldBeReturned() throws Exception {
       mockMvc.perform(getAsAdmin("/api/2/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.totalElements", greaterThanOrEqualTo(5)));
    }

    @Test
    public void givenUser1IsAuthenticatedWhenCallsCollectionResourceThenOnlyUser1ShouldBeReturned() throws Exception {
        mockMvc.perform(getAsUser1("/api/2/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.totalElements", greaterThanOrEqualTo(1)));
    }

    @Test
    public void testCollectionResourceJsonEquality() throws Exception {
        mockMvc.perform(getAsUser1("/api/2/users"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/user/users.json"));
    }
}
