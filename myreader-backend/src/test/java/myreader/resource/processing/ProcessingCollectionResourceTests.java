package myreader.resource.processing;

import myreader.test.IntegrationTestSupport;
import org.junit.Test;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.putAsAdmin;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
public class ProcessingCollectionResourceTests extends IntegrationTestSupport {

    @Test
    public void shouldRejectInvalidProcessingRequest() throws Exception {
        mockMvc.perform(putAsAdmin("/api/2/processing")
                .json("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("status", is(400)))
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors", hasSize(1)))
                .andExpect(jsonPath("fieldErrors[0].field", is("process")))
                .andExpect(jsonPath("fieldErrors[0].message", is("process does not exists")));
    }

    @Test
    public void shouldAcceptValidProcessingRequest() throws Exception {
        mockMvc.perform(putAsAdmin("/api/2/processing")
                .json("{ 'process': 'indexSyncJob' }"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("done", is(false)))
                .andExpect(jsonPath("cancelled", is(false)));
    }
}
