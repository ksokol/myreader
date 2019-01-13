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

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
public class ExclusionPatternEntityResourceTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(TestConstants.USER113)
    public void testEntityResourceForUser1JsonStructureEquality() throws Exception {
        mockMvc.perform(get("/api/2/exclusions/1101/pattern/7"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid", is("7")))
                .andExpect(jsonPath("$.hitCount", is(1)))
                .andExpect(jsonPath("$.pattern", is("user113_subscription1_pattern1")));
    }

    @Test
    @WithMockUser(TestConstants.USER2)
    public void testEntityResourceForUser2NotFound() throws Exception {
        mockMvc.perform(get("/api/2/exclusions/1/pattern/0"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(TestConstants.USER114)
    public void testDelete() throws Exception {
        mockMvc.perform(get("/api/2/exclusions/1102/pattern/8"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("uuid", is("8")));

        mockMvc.perform(delete("/api/2/exclusions/1102/pattern/8"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/2/exclusions/1102/pattern/8"))
                .andExpect(status().isNotFound());
    }
}
