package myreader.controller;

import myreader.test.TestConstants;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@WithMockUser(TestConstants.USER1)
public class ApiUnknownResourceControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void shouldReturn404WhenGettingResourceIsUnknown() throws Exception {
        mockMvc.perform(get("/api/unknown"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void shouldReturn404WhenPostingToResourceIsUnknown() throws Exception {
        mockMvc.perform(post("/api/unknown"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void shouldReturn404WenPatchingResourceIsUnknown() throws Exception {
        mockMvc.perform(patch("/api/unknown"))
                .andExpect(status().isNotFound());
    }
}
