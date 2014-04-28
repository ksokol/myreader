package myreader.resource.user;

import myreader.repository.UserRepository;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.not;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public class UserEntityResourceTest extends IntegrationTestSupport {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testReadRestriction() throws Exception {
       mockMvc.perform(getAsAdmin("/users/1")).andExpect(status().isNotFound());
    }

    @Test
    public void tesUpdateRestriction() throws Exception {
        mockMvc.perform(patchAsUser2("/users/1")
                .json("{'password':'test'}"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testEntityResourceJsonStructureEquality() throws Exception {
       mockMvc.perform(getAsUser1("/users/1"))
                .andExpect(content().isJsonEqual("user/user#1.json"));
    }

    @Test
    public void testEntityResourceJsonEquality() throws Exception {
        mockMvc.perform(getAsUser1("/users/1"))
                .andExpect(content().isJsonEqual("user/user#1.json"));
    }

    @Test
    public void testSuccessfulPasswordReset() throws Exception {
        String oldPassword = userRepository.findOne(1L).getPassword();
        String passwordToSet = "test";

        mockMvc.perform(getAsUser1("/users/1"))
                .andExpect(content().isJsonEqual("user/user#1.json"));

        mockMvc.perform(patchAsUser1("/users/1")
                .json("{'password':'" + passwordToSet + "'}"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("user/user#1.json"));

        mockMvc.perform(getAsUser1("/users/1"))
                .andExpect(status().isUnauthorized());

        String newPassword = userRepository.findOne(1L).getPassword();
        assertThat(newPassword, not(equalTo(passwordToSet)));

        mockMvc.perform(getAsUser("user1@localhost", passwordToSet, "/users/1"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("user/user#1.json"));

        assertThat(oldPassword, not(equalTo(newPassword)));
    }

    @Test
    public void testNothingToUpdate() throws Exception {
        mockMvc.perform(getAsUser1("/users/1"))
                .andExpect(content().isJsonEqual("user/user#1.json"));

        mockMvc.perform(patchAsUser1("/users/1")
                .json("user/patch-user#1.json"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("user/user#1.json"));

        mockMvc.perform(getAsUser1("/users/1"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("user/user#1.json"));
    }

}
