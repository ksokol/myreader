package myreader.resource.user;

import myreader.repository.UserRepository;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import static net.javacrumbs.jsonunit.JsonAssert.assertJsonEquals;
import static net.javacrumbs.jsonunit.JsonAssert.assertJsonStructureEquals;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.not;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"password\":\"test\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testEntityResourceJsonStructureEquality() throws Exception {
        MvcResult result = mockMvc.perform(getAsUser1("/users/1")).andReturn();
        assertJsonStructureEquals(jsonFromFile("user/user#1.json"), result.getResponse().getContentAsString());
    }

    @Test
    public void testEntityResourceJsonEquality() throws Exception {
        MvcResult result = mockMvc.perform(getAsUser1("/users/1")).andReturn();
        assertJsonEquals(jsonFromFile("user/user#1.json"), result.getResponse().getContentAsString());
    }

    @Test
    public void testSuccessfulPasswordReset() throws Exception {
        String oldPassword = userRepository.findOne(1L).getPassword();
        String passwordToSet = "test";

        MvcResult result = mockMvc.perform(getAsUser1("/users/1")).andReturn();
        assertJsonEquals(jsonFromFile("user/user#1.json"), result.getResponse().getContentAsString());

        MvcResult result1 = mockMvc.perform(patchAsUser1("/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"password\":\"" + passwordToSet + "\"}"))
                .andExpect(status().isOk())
                .andReturn();

        assertJsonEquals(jsonFromFile("user/user#1.json"), result1.getResponse().getContentAsString());

        mockMvc.perform(getAsUser1("/users/1"))
                .andExpect(status().isUnauthorized());

        String newPassword = userRepository.findOne(1L).getPassword();
        assertThat(newPassword, not(equalTo(passwordToSet)));

        MvcResult result2 = mockMvc.perform(getAsUser("user1@localhost", passwordToSet, "/users/1"))
                .andExpect(status().isOk())
                .andReturn();

        assertJsonEquals(jsonFromFile("user/user#1.json"), result2.getResponse().getContentAsString());
        assertThat(oldPassword, not(equalTo(newPassword)));
    }

    @Test
    public void testNothingToUpdate() throws Exception {
        MvcResult result = mockMvc.perform(getAsUser1("/users/1")).andReturn();
        assertJsonEquals(jsonFromFile("user/user#1.json"), result.getResponse().getContentAsString());

        MvcResult result1 = mockMvc.perform(patchAsUser1("/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonFromFile("user/patch-user#1.json")))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();

        assertJsonEquals(jsonFromFile("user/user#1.json"), result1.getResponse().getContentAsString());

        MvcResult result2 = mockMvc.perform(getAsUser1("/users/1"))
                .andExpect(status().isOk())
                .andReturn();

        assertJsonEquals(jsonFromFile("user/user#1.json"), result2.getResponse().getContentAsString());
    }

}
