package myreader.resource.exception.handler;

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.postAsUser2;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import myreader.service.time.TimeService;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author Kamill Sokol
 */
public class ExceptionHandlerTest extends IntegrationTestSupport {

    @Autowired
    private TimeService timeServiceMock;

    @Test
    public void testRuntimeException() throws Exception {
        when(timeServiceMock.getCurrentTime()).thenThrow(new RuntimeException("exception")) ;

        mockMvc.perform(postAsUser2("/subscriptions")
                .json("{ 'origin': 'http://use-the-index-luke.com/blog/feed' }"))
                .andExpect(jsonPath("status", is(500)))
                .andExpect(jsonPath("message", is("exception")));
    }

    @Test
    public void testJsonWrongFormat() throws Exception {
        mockMvc.perform(patchAsUser1("/subscriptionEntries")
                .json("[{ 'uuid': '1002', 'seen': false }]"))
                .andExpect(jsonPath("status", is(400)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testJsonSyntaxError() throws Exception {
        mockMvc.perform(patchAsUser1("/subscriptionEntries")
                .contentType(APPLICATION_JSON)
                .content("{[]"))
                .andExpect(jsonPath("status", is(400)));
    }

}
