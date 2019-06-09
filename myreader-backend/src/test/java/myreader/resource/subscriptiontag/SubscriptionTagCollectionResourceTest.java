package myreader.resource.subscriptiontag;

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

import java.util.TimeZone;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
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
public class SubscriptionTagCollectionResourceTest {

    static {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(TestConstants.USER2)
    public void shouldFetchSubscriptionTagsForUser2() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionTags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].uuid", is("4")))
                .andExpect(jsonPath("$.content[0].name", is("tag1")))
                .andExpect(jsonPath("$.content[0].color", nullValue()))
                .andExpect(jsonPath("$.content[0].createdAt", is("2011-05-15T19:20:46.000+0000")))
                .andExpect(jsonPath("$.content[1].uuid", is("5")))
                .andExpect(jsonPath("$.content[1].name", is("tag2")))
                .andExpect(jsonPath("$.content[1].color", nullValue()))
                .andExpect(jsonPath("$.content[1].createdAt", is("2011-05-15T19:20:46.000+0000")));
    }

    @Test
    @WithMockUser(TestConstants.USER4)
    public void shouldFetchSubscriptionTagsForUser4() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionTags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(0)));
    }
}
