package myreader.resource.feed;

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

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@Sql("classpath:test-data.sql")
@WithMockUser(username = TestConstants.ADMIN, roles = { "ADMIN" })
@WithTestProperties
public class FeedCollectionResourceTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testCollectionResource() throws Exception {
        mockMvc.perform(get("/api/2/feeds"))
                .andExpect(jsonPath("$.links[0].rel", is("self")))
                .andExpect(jsonPath("$.links[0].href", endsWith("/api/2/feeds?page=0&size=20")))
                .andExpect(jsonPath("$.content[0].uuid", is("0")))
                .andExpect(jsonPath("$.content[0].title", is("The Java Posse")))
                .andExpect(jsonPath("$.content[0].url", is("http://feeds.feedburner.com/javaposse")))
                .andExpect(jsonPath("$.content[0].lastModified", is("Thu, 27 Mar 2014 13:23:32 GMT")))
                .andExpect(jsonPath("$.content[0].fetched", is(282)))
                .andExpect(jsonPath("$.content[0].hasErrors", is(false)))
                .andExpect(jsonPath("$.content[0].createdAt", is("2011-04-15T22:20:46.000+00:00")))
                .andExpect(jsonPath("$.content[1].uuid", is("1")))
                .andExpect(jsonPath("$.content[2].uuid", is("2")))
                .andExpect(jsonPath("$.content[3].uuid", is("3")))
                .andExpect(jsonPath("$.content[4].uuid", is("4")))
                .andExpect(jsonPath("$.content[5].uuid", is("5")))
                .andExpect(jsonPath("$.content[6].uuid", is("6")))
                .andExpect(jsonPath("$.content[7].uuid", is("7")))
                .andExpect(jsonPath("$.content[8].uuid", is("8")))
                .andExpect(jsonPath("$.content[9].uuid", is("9")))
                .andExpect(jsonPath("$.content[10].uuid", is("10")))
                .andExpect(jsonPath("$.content[11].uuid", is("11")))
                .andExpect(jsonPath("$.content[12].uuid", is("12")))
                .andExpect(jsonPath("$.content[13].uuid", is("13")))
                .andExpect(jsonPath("$.content[14].uuid", is("14")))
                .andExpect(jsonPath("$.content[15].uuid", is("15")))
                .andExpect(jsonPath("$.content[16].uuid", is("16")))
                .andExpect(jsonPath("$.content[17].uuid", is("17")))
                .andExpect(jsonPath("$.content[18].uuid", is("18")))
                .andExpect(jsonPath("$.content[19].uuid", is("100")))
                .andExpect(jsonPath("$.page.totalElements", is(20)));
    }
}
