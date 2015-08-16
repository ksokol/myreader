package myreader.resource.subscriptionentry.converter;

import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import myreader.entity.SubscriptionEntry;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;

import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryGetResponseConverterTest {

    private SubscriptionEntryGetResponseConverter uut;

    @Before
    public void setUp() throws Exception {
        MockHttpServletRequest mockHttpServletRequest = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(mockHttpServletRequest));
        uut = new SubscriptionEntryGetResponseConverter();
    }

    @Test
    public void testNpe() throws Exception {
        SubscriptionEntry entry = new SubscriptionEntry();
        SubscriptionEntryGetResponse response = uut.toResource(entry);
        assertThat(response.getOrigin(), nullValue());
        assertThat(response.getFeedTitle(), nullValue());
        assertThat(response.getTitle(), nullValue());
        assertThat(response.getContent(), nullValue());
        assertThat(response.getFeedTitle(), nullValue());

    }
}
