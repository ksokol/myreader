package myreader.controller;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ApiUnknownResourceControllerTest extends IntegrationTestSupport {

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
