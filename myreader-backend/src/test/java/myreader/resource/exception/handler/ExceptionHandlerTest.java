package myreader.resource.exception.handler;

import myreader.service.subscription.SubscriptionService;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Matchers.anyString;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.postAsUser100;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
public class ExceptionHandlerTest extends IntegrationTestSupport {

    @SpyBean
    private SubscriptionService subscriptionService;

    @Test
    public void testRuntimeException() throws Exception {
        willThrow(new RuntimeException("exception")).given(subscriptionService).subscribe(anyString(), anyString());

        mockMvc.perform(postAsUser100("/api/2/subscriptions")
                .json("{ 'origin': 'http://use-the-index-luke.com/blog/feed' }"))
                .andExpect(jsonPath("status", is(500)))
                .andExpect(jsonPath("message", is("exception")));
    }

    @Test
    public void testJsonWrongFormat() throws Exception {
        mockMvc.perform(patchAsUser1("/api/2/subscriptionEntries")
                .json("[{ 'uuid': '1002', 'seen': false }]"))
                .andExpect(jsonPath("status", is(400)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testJsonSyntaxError() throws Exception {
        mockMvc.perform(patchAsUser1("/api/2/subscriptionEntries")
                .contentType(APPLICATION_JSON)
                .content("{[]"))
                .andExpect(jsonPath("status", is(400)));
    }

}
