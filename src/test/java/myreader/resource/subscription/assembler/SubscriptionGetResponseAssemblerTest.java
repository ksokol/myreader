package myreader.resource.subscription.assembler;

import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import myreader.entity.Subscription;
import myreader.resource.config.ResourceConfig;
import myreader.resource.subscription.beans.SubscriptionGetResponse;

import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @author Kamill Sokol
 */
public class SubscriptionGetResponseAssemblerTest {

    private SubscriptionGetResponseAssembler uut;

    @Before
    public void setUp() throws Exception {
        MockHttpServletRequest mockHttpServletRequest = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(mockHttpServletRequest));
        uut = new SubscriptionGetResponseAssembler(new ResourceConfig().entityLinks());
    }

    @Test
    public void testNpe() throws Exception {
        Subscription subscription = new Subscription();
        SubscriptionGetResponse response = uut.toResource(subscription);
        assertThat(response.getLink("origin"), nullValue());
    }
}
