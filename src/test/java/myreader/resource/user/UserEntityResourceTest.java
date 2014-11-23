package myreader.resource.user;

import myreader.repository.UserRepository;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsAdmin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
public class UserEntityResourceTest extends IntegrationTestSupport {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testReadRestriction() throws Exception {
       mockMvc.perform(getAsAdmin("/users/1")).andExpect(status().isNotFound());
    }

    @Test
    public void testEntityResourceJsonStructureEquality() throws Exception {
       mockMvc.perform(getAsUser1("/users/1"))
               .andExpect(status().isOk())
               .andExpect(jsonEquals("user/1.json"));
    }

    @Test
    public void testEntityResourceJsonEquality() throws Exception {
        mockMvc.perform(getAsUser1("/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("user/1.json"));
    }

    @Test
    public void testUser2Subscriptions() throws Exception {
        mockMvc.perform(getAsUser2("/users/2/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("user/2#subscriptions.json"));
    }

    @Test
    public void testNotFoundWhenGetNotOwnSubscription() throws Exception {
        mockMvc.perform(getAsUser2("/users/1/subscriptions"))
                .andExpect(status().isNotFound());
    }
}
