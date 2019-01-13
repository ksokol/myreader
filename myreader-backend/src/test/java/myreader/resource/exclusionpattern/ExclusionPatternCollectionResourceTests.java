package myreader.resource.exclusionpattern;

import myreader.test.TestConstants;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
public class ExclusionPatternCollectionResourceTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(TestConstants.USER111)
    public void testCollectionResourceForUser111JsonStructureEquality() throws Exception {
        mockMvc.perform(get("/api/2/exclusions/109/pattern"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].uuid", is("5")))
                .andExpect(jsonPath("$.content[0].hitCount", is(1)))
                .andExpect(jsonPath("$.content[0].pattern", is("user111_subscription1_pattern1")))
                .andExpect(jsonPath("$.content[1].uuid", is("6")))
                .andExpect(jsonPath("$.content[1].hitCount", is(1)))
                .andExpect(jsonPath("$.content[1].pattern", is("user111_subscription1_pattern2")));
    }

    @Test
    @WithMockUser(TestConstants.USER2)
    public void testCollectionResourceForUser2NotFound() throws Exception {
        mockMvc.perform(get("/api/2/exclusions/1/pattern"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(TestConstants.USER2)
    public void testPost() throws Exception {
        mockMvc.perform(post("/api/2/exclusions/9/pattern")
                .with(jsonBody("{'pattern': 'test'}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid", is("10")))
                .andExpect(jsonPath("$.hitCount", is(0)))
                .andExpect(jsonPath("$.pattern", is("test")));

        mockMvc.perform(get("/api/2/exclusions/9/pattern"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].uuid", is("10")))
                .andExpect(jsonPath("$.content[0].hitCount", is(0)))
                .andExpect(jsonPath("$.content[0].pattern", is("test")));
    }

    @Test
    @WithMockUser(TestConstants.USER2)
    public void testPostInvalidEmptyPattern() throws Exception {
        mockMvc.perform(post("/api/2/exclusions/9/pattern")
                .with(jsonBody("{'pattern': ''}")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", is("validation error")))
                .andExpect(jsonPath("$.fieldErrors[0].field", is("pattern")))
                .andExpect(jsonPath("$.fieldErrors[0].message", is("invalid regular expression")));
    }

    @Test
    @WithMockUser(TestConstants.USER2)
    public void testPostInvalidNullPattern() throws Exception {
        mockMvc.perform(post("/api/2/exclusions/9/pattern")
                .with(jsonBody("{'pattern': null}")))
                .andExpect(status().isBadRequest())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", is("validation error")))
                .andExpect(jsonPath("$.fieldErrors[0].field", is("pattern")))
                .andExpect(jsonPath("$.fieldErrors[0].message", is("invalid regular expression")));
    }

    @Test
    @WithMockUser(TestConstants.USER2)
    public void testPostInvalidPattern() throws Exception {
        mockMvc.perform(post("/api/2/exclusions/9/pattern")
                .with(jsonBody("{'pattern': '\\\\k'}")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", is("validation error")))
                .andExpect(jsonPath("$.fieldErrors[0].field", is("pattern")))
                .andExpect(jsonPath("$.fieldErrors[0].message", is("invalid regular expression")));
    }

    @Test
    @WithMockUser(TestConstants.USER115)
    public void testPostDuplicate() throws Exception {
        mockMvc.perform(get("/api/2/exclusions/1103/pattern"))
                .andExpect(jsonPath("$.content[0].uuid", is("9")))
                .andExpect(jsonPath("$.content[0].hitCount", is(1)))
                .andExpect(jsonPath("$.content[0].pattern", is("user115_subscription1_pattern1")));

        mockMvc.perform(post("/api/2/exclusions/1103/pattern")
                .with(jsonBody("{'pattern': 'user115_subscription1_pattern1'}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid", is("9")))
                .andExpect(jsonPath("$.hitCount", is(1)))
                .andExpect(jsonPath("$.pattern", is("user115_subscription1_pattern1")));

        mockMvc.perform(get("/api/2/exclusions/1103/pattern"))
                .andExpect(jsonPath("$.content[0].uuid", is("9")))
                .andExpect(jsonPath("$.content[0].hitCount", is(1)))
                .andExpect(jsonPath("$.content[0].pattern", is("user115_subscription1_pattern1")));
    }
}
