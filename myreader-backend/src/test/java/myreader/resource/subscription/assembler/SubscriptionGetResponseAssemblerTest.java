package myreader.resource.subscription.assembler;

import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import myreader.entity.Subscription;

/**
 * @author Kamill Sokol
 */
public class SubscriptionGetResponseAssemblerTest {

    private SubscriptionGetResponseAssemblerSupport uut;

    @Before
    public void setUp() throws Exception {
        MockHttpServletRequest mockHttpServletRequest = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(mockHttpServletRequest));
        uut = new SubscriptionGetResponseAssemblerSupport();
    }

    @Test
    public void testNpe() throws Exception {
        Subscription subscription = new Subscription();
        uut.toResource(subscription);
    }
}
