package myreader.resource.subscriptiontag;

import myreader.test.TestConstants;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.TimeZone;

import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@TestPropertySource(properties = {"task.enabled = false"})
@Sql("classpath:test-data.sql")
public class SubscriptionTagResourceTest {

    static {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(TestConstants.USER2)
    public void shouldNotPatchWhenOwnerDoesNotOwnTag() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionTags/1")
                .with(jsonBody("{'name': 'expected name', 'color': '#111'}")))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldPatchWhenOwnerDoesNotOwnTag() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionTags/1")
                .with(jsonBody("{'name': 'expected name', 'color': '#111'}")))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldReturnPatchedTag() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionTags/1")
                .with(jsonBody("{'name': 'expected name', 'color': '#111'}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid", is("1")))
                .andExpect(jsonPath("$.name", is("expected name")))
                .andExpect(jsonPath("$.color", is("#111")))
                .andExpect(jsonPath("$.createdAt", is("2011-05-15T19:20:46Z")));
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldReturnSubscriptionWithPatchedTag() throws Exception {
        mockMvc.perform(get("/api/2/subscriptions/1"))
                .andExpect(jsonPath("$.feedTag.uuid", is("1")))
                .andExpect(jsonPath("$.feedTag.name", is("tag1")))
                .andExpect(jsonPath("$.feedTag.color", nullValue()))
                .andExpect(jsonPath("$.feedTag.createdAt", is("2011-05-15T19:20:46Z")));

        mockMvc.perform(patch("/api/2/subscriptionTags/1")
                .with(jsonBody("{'name': 'expected name', 'color': '#111'}")));

        mockMvc.perform(get("/api/2/subscriptions/1"))
                .andExpect(jsonPath("$.feedTag.uuid", is("1")))
                .andExpect(jsonPath("$.feedTag.name", is("expected name")))
                .andExpect(jsonPath("$.feedTag.color", is("#111")))
                .andExpect(jsonPath("$.feedTag.createdAt", is("2011-05-15T19:20:46Z")));
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldReturnOtherSubscriptionWithPatchedTagWhenItReferencesTheSameTag() throws Exception {
        mockMvc.perform(get("/api/2/subscriptions/2"))
                .andExpect(jsonPath("$.feedTag.uuid", is("1")))
                .andExpect(jsonPath("$.feedTag.name", is("tag1")))
                .andExpect(jsonPath("$.feedTag.color", nullValue()))
                .andExpect(jsonPath("$.feedTag.createdAt", is("2011-05-15T19:20:46Z")));

        mockMvc.perform(patch("/api/2/subscriptionTags/1")
                .with(jsonBody("{'name': 'expected name', 'color': '#111'}")));

        mockMvc.perform(get("/api/2/subscriptions/2"))
                .andExpect(jsonPath("$.feedTag.uuid", is("1")))
                .andExpect(jsonPath("$.feedTag.name", is("expected name")))
                .andExpect(jsonPath("$.feedTag.color", is("#111")))
                .andExpect(jsonPath("$.feedTag.createdAt", is("2011-05-15T19:20:46Z")));
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldRejectPatchRequestWhenNameIsMissing() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionTags/1")
                .with(jsonBody("{}")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("status", is(400)))
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", contains("name")))
                .andExpect(jsonPath("fieldErrors..message", hasItems("may not be empty")));
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldRejectPatchRequestWhenColorIsSomeString() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionTags/1")
                .with(jsonBody("{'name': 'name', 'color': 'yellow'}")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("status", is(400)))
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", contains("color")))
                .andExpect(jsonPath("fieldErrors..message", hasItems("not a RGB hex code")));
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldRejectPatchRequestWhenColorIsAnInvalidRgbHexCode() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionTags/1")
                .with(jsonBody("{'name': 'name', 'color': '#0000000'}")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("status", is(400)))
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", contains("color")))
                .andExpect(jsonPath("fieldErrors..message", hasItems("not a RGB hex code")));
    }
}
