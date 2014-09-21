package myreader.resource.subscription;

import static org.hamcrest.Matchers.endsWith;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser3;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.postAsUser2;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

import java.util.Date;

import myreader.service.time.TimeService;
import myreader.test.IntegrationTestSupport;

import org.joda.time.format.ISODateTimeFormat;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author Kamill Sokol
 */
public class SubscriptionCollectionResourceTest extends IntegrationTestSupport {

    @Autowired
    private TimeService timeServiceMock;

    @Test
    public void testCollectionResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscription/subscriptions.json"));
    }

    @Test
    public void testFieldErrorWhenUrlIsEmpty() throws Exception {
        mockMvc.perform(postAsUser2("/subscriptions")
                .json("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().isJsonEqual("subscription/post-empty-url.json"));
    }

    @Test
    public void testFieldErrorWhenUrlHasInvalidPattern() throws Exception {
        mockMvc.perform(postAsUser2("/subscriptions")
                .json("{'url':'invalid url'}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().isJsonEqual("subscription/post-invalid-url.json"));
    }

    @Test
    public void testFieldErrorWhenPostingExistentSubscription() throws Exception {
        mockMvc.perform(postAsUser2("/subscriptions")
                .json("subscription/post-duplicate-request.json"))
                .andExpect(status().isBadRequest())
                .andExpect(content().isJsonEqual("subscription/post-duplicate-response.json"));
    }

    @Test
    public void testSuccessWhenPostingNewSubscription() throws Exception {
        Date now = ISODateTimeFormat.dateTimeNoMillis().parseDateTime("2014-04-30T12:43:46Z").toDate();

        when(timeServiceMock.getCurrentTime()).thenReturn(now);

        mockMvc.perform(postAsUser2("/subscriptions")
                .json("subscription/post-new-request.json"))
                .andExpect(status().isOk())
                .andExpect(content().isJsonEqual("subscription/post-new-response.json"));
    }

	@Test
	public void testDoubleEncodingInSubscriptionSubscriptionTagGroup() throws Exception {
		mockMvc.perform(getAsUser3("/subscriptions"))
				.andExpect(jsonPath("$.content[?(@.title=='user3_subscription2')].links[?(@.rel=='subscriptionTagGroup')].href[0]", endsWith("/tagWith%252FForward")));

	}
}
