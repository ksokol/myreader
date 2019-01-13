package myreader.resource.exception.handler;

import myreader.service.subscription.SubscriptionService;
import myreader.test.TestConstants;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.willThrow;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
public class ExceptionHandlerTests {

    @Autowired
    private MockMvc mockMvc;

    @SpyBean
    private SubscriptionService subscriptionService;

    @Test
    @WithMockUser(TestConstants.USER100)
    public void testRuntimeException() throws Exception {
        willThrow(new RuntimeException("exception")).given(subscriptionService).subscribe(anyString(), anyString());

        mockMvc.perform(post("/api/2/subscriptions")
                .with(jsonBody("{'origin': 'http://use-the-index-luke.com/blog/feed'}")))
                .andExpect(jsonPath("status", is(500)))
                .andExpect(jsonPath("message", is("exception")));
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void testJsonWrongFormat() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionEntries")
                .with(jsonBody("[{'uuid': '1002', 'seen': false}]")))
                .andExpect(jsonPath("status", is(400)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void testJsonSyntaxError() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionEntries")
                .contentType(APPLICATION_JSON)
                .content("{[]"))
                .andExpect(jsonPath("status", is(400)));
    }

}
