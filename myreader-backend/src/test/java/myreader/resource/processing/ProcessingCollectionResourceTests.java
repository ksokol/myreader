package myreader.resource.processing;

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
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@WithMockUser(username = TestConstants.ADMIN, roles = { "ADMIN" })
public class ProcessingCollectionResourceTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void shouldRejectInvalidProcessingRequest() throws Exception {
        mockMvc.perform(put("/api/2/processing")
                .with(jsonBody("{}")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("status", is(400)))
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors", hasSize(1)))
                .andExpect(jsonPath("fieldErrors[0].field", is("process")))
                .andExpect(jsonPath("fieldErrors[0].message", is("process does not exists")));
    }

    @Test
    public void shouldAcceptValidProcessingRequest() throws Exception {
        mockMvc.perform(put("/api/2/processing")
                .with(jsonBody("{'process': 'indexSyncJob'}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("done", is(false)))
                .andExpect(jsonPath("cancelled", is(false)));
    }
}
