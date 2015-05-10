package myreader.resource.subscriptionentry.assembler;

import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import myreader.entity.SearchableSubscriptionEntry;

/**
 * @author Kamill Sokol
 */
public class SearchableSubscriptionEntryGetResponseAssemblerTest {

    private SearchableSubscriptionEntryGetResponseAssembler uut;

    @Before
    public void setUp() throws Exception {
        MockHttpServletRequest mockHttpServletRequest = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(mockHttpServletRequest));
        uut = new SearchableSubscriptionEntryGetResponseAssembler();
    }

    @Test
    public void testNpe() throws Exception {
        SearchableSubscriptionEntry searchableSubscriptionEntry = new SearchableSubscriptionEntry();
        uut.toResource(searchableSubscriptionEntry);
    }
}
