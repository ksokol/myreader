package myreader.resource.exclusionset;

import myreader.test.TestConstants;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@Sql("classpath:test-data.sql")
@SpringBootTest
public class ExclusionSetEntityResourceTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(TestConstants.USER1)
    public void testCollectionEntityForUser1JsonStructureEquality() throws Exception {
        mockMvc.perform(get("/api/2/exclusions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid", is("1")))
                .andExpect(jsonPath("$.patternCount", is(2)))
                .andExpect(jsonPath("$.overallPatternHits", is(2)));
    }

    @Test
    @WithMockUser(TestConstants.USER3)
    public void testCollectionEntityForNotFoundForUser3() throws Exception {
        mockMvc.perform(get("/api/2/exclusions/6"))
                .andExpect(status().isNotFound());
    }
}
