package myreader.resource.subscriptiontaggroup.assembler;

import myreader.entity.TagGroup;
import myreader.resource.config.ResourceConfig;

import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @author Kamill Sokol
 */
public class SubscriptionTagGroupGetResponseAssemblerTest {

    private SubscriptionTagGroupGetResponseAssembler uut;

    @Before
    public void setUp() throws Exception {
        MockHttpServletRequest mockHttpServletRequest = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(mockHttpServletRequest));
        uut = new SubscriptionTagGroupGetResponseAssembler(new ResourceConfig().entityLinks());
    }

    @Test
    public void testNpe() throws Exception {
        TagGroup subscription = new TagGroup(0, null, 0, null);
        uut.toResource(subscription);
    }
}
