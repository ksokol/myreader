package myreader.resource.subscription;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.postAsUser2;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Date;

import org.joda.time.format.ISODateTimeFormat;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import myreader.service.time.TimeService;
import myreader.test.IntegrationTestSupport;

/**
 * @author Kamill Sokol
 */
public class SubscriptionCollectionResourceTest extends IntegrationTestSupport {

    @Autowired
    private TimeService timeServiceMock;

    @Test
    public void testCollectionResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptions?unseenGreaterThan=-1"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/structure.json"));
    }

    @Test
    public void testFieldErrorWhenUrlIsEmpty() throws Exception {
        mockMvc.perform(postAsUser2("/subscriptions")
                .json("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonEquals("json/subscription/post-empty-url.json"));
    }

    @Test
    public void testFieldErrorWhenUrlHasInvalidPattern() throws Exception {
        mockMvc.perform(postAsUser2("/subscriptions")
                .json("{'url':'invalid url'}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonEquals("json/subscription/post-invalid-url.json"));
    }

    @Test
    public void testFieldErrorWhenPostingExistentSubscription() throws Exception {
        mockMvc.perform(postAsUser2("/subscriptions")
                .json("json/subscription/post-duplicate-request.json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonEquals("json/subscription/post-duplicate-response.json"));
    }

    @Test
    public void testSuccessWhenPostingNewSubscription() throws Exception {
        Date now = ISODateTimeFormat.dateTimeNoMillis().parseDateTime("2014-04-30T12:43:46Z").toDate();

        when(timeServiceMock.getCurrentTime()).thenReturn(now);

        mockMvc.perform(postAsUser2("/subscriptions")
                .json("json/subscription/post-new-request.json"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/post-new-response.json"));
    }

}
