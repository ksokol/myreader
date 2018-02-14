package myreader.controller;

import myreader.test.annotation.WithMockUser1;
import myreader.test.annotation.WithMockUserAdmin;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
public class ActuatorTest {

    @Autowired
    private MockMvc mockMvc;

    @Value("${job.fetchError.retainInDays}")
    private int retainInDays;

    @Test
    @WithMockUser1
    public void shouldReturnGitCommitDetails() throws Exception {
        mockMvc.perform(get("/info"))
                .andExpect(jsonPath("git", not(empty())));
    }

    @Test
    @WithMockUserAdmin
    public void shouldReturnAppDetails() throws Exception {
        mockMvc.perform(get("/info"))
                .andExpect(jsonPath("app.fetchErrorRetainDays", is(retainInDays)));
    }
}
