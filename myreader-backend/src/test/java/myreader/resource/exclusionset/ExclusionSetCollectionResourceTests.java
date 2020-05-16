package myreader.resource.exclusionset;

import myreader.test.TestConstants;
import myreader.test.WithTestProperties;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@Sql("classpath:test-data.sql")
@WithTestProperties
public class ExclusionSetCollectionResourceTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = TestConstants.USER105)
    public void testCollectionResourceForUser105JsonStructureEquality() throws Exception {
        mockMvc.perform(get("/api/2/exclusions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.links[0].rel", is("self")))
                .andExpect(jsonPath("$.links[0].href", endsWith("/api/2/exclusions")))
                .andExpect(jsonPath("$.content[0].uuid", is("103")))
                .andExpect(jsonPath("$.content[0].patternCount", is(0)))
                .andExpect(jsonPath("$.content[0].overallPatternHits", is(0)))
                .andExpect(jsonPath("$.page.totalElements", is(1)));
    }

    @Test
    @WithMockUser(username = TestConstants.USER4)
    public void testCollectionResourceForUser4JsonStructureEquality() throws Exception {
        mockMvc.perform(get("/api/2/exclusions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].uuid", is("14")))
                .andExpect(jsonPath("$.content[0].patternCount", is(0)))
                .andExpect(jsonPath("$.content[0].overallPatternHits", is(0)))
                .andExpect(jsonPath("$.content[1].uuid", is("15")))
                .andExpect(jsonPath("$.content[1].patternCount", is(0)))
                .andExpect(jsonPath("$.content[1].overallPatternHits", is(0)))
                .andExpect(jsonPath("$.page.totalElements", is(2)));
    }
}
