package myreader.resource.subscription;

import myreader.service.time.TimeService;
import myreader.test.IntegrationTestSupport;
import org.joda.time.format.ISODateTimeFormat;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchersWithJsonAssertSupport.content;

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
    public void testSubscriptionTagGroup() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions/tagGroup/tag1"))
                .andExpect(content().isJsonEqual("subscription/subscription#tagGroup#tag1.json"));
    }

    @Ignore
    @Test
    public void testSubscriptionTagGroupWithDot() throws Exception {
        mockMvc.perform(getAsUser1("/subscriptions/tagGroup/tag1"))
                .andExpect(content().isJsonEqual("subscription/subscription#tagGroup#tag.with.dot.json"));
    }
}
