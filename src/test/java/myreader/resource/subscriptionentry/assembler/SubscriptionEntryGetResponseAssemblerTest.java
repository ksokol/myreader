package myreader.resource.subscriptionentry.assembler;

import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import myreader.entity.SubscriptionEntry;
import myreader.resource.config.ResourceConfig;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;

import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryGetResponseAssemblerTest {

    private SubscriptionEntryGetResponseAssembler uut;

    @Before
    public void setUp() throws Exception {
        MockHttpServletRequest mockHttpServletRequest = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(mockHttpServletRequest));
        uut = new SubscriptionEntryGetResponseAssembler(new ResourceConfig().entityLinks());
    }

    @Test
    public void testNpe() throws Exception {
        SubscriptionEntry entry = new SubscriptionEntry();
        SubscriptionEntryGetResponse response = uut.toResource(entry);
        assertThat(response.getLink("origin"), nullValue());
        assertThat(response.getLink("subscription"), nullValue());
        assertThat(response.getTitle(), nullValue());
        assertThat(response.getContent(), nullValue());
        assertThat(response.getFeedTitle(), nullValue());

    }
}
