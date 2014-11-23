package myreader.resource.exception.handler;

import myreader.service.time.TimeService;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.postAsUser2;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

/**
 * @author Kamill Sokol
 */
public class DefaultExceptionHandlerTest extends IntegrationTestSupport {

    @Autowired
    private TimeService timeServiceMock;

    @Test
    public void testRuntimeException() throws Exception {
        when(timeServiceMock.getCurrentTime()).thenThrow(new RuntimeException("exception")) ;

        mockMvc.perform(postAsUser2("/subscriptions")
                .json("json/subscription/post-new-request.json"))
                .andExpect(jsonPath("status", is(500)))
                .andExpect(jsonPath("message", is("exception")));
    }

}
