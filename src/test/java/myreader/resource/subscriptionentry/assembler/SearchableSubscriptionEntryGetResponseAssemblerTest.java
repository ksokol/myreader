package myreader.resource.subscriptionentry.assembler;

import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import myreader.entity.SearchableSubscriptionEntry;
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
        SubscriptionEntryGetResponse response = uut.toResource(searchableSubscriptionEntry);

        assertThat(response.getLink("subscription"), nullValue());
        assertThat(response.getLink("origin"), nullValue());
    }
}
