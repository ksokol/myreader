package myreader.service.search;

import static myreader.hamcrest.Matchers.isInDescendingOrdering;
import static org.junit.Assert.assertThat;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.test.IntegrationTestSupport;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntrySearchRepositoryTest extends IntegrationTestSupport {

    @Autowired
    private SubscriptionEntrySearchRepository uut;

    @Test
    public void testReturnsEntriesInDescendingOrder() {
        Page<SearchableSubscriptionEntry> all = uut.findAll(new PageRequest(0, 100));
        assertThat(all.getContent(), isInDescendingOrdering());
    }
}
