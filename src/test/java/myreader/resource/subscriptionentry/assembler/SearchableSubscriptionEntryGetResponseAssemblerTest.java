package myreader.resource.subscriptionentry.assembler;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.resource.config.ResourceConfig;

import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @author Kamill Sokol
 */
public class SearchableSubscriptionEntryGetResponseAssemblerTest {

    private SearchableSubscriptionEntryGetResponseAssembler uut;

    @Before
    public void setUp() throws Exception {
        MockHttpServletRequest mockHttpServletRequest = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(mockHttpServletRequest));
        uut = new SearchableSubscriptionEntryGetResponseAssembler(new ResourceConfig().entityLinks());
    }

    @Test
    public void testNpe() throws Exception {
        SearchableSubscriptionEntry searchableSubscriptionEntry = new SearchableSubscriptionEntry();
        uut.toResource(searchableSubscriptionEntry);
    }
}
