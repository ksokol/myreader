package myreader.service.search;

import static org.junit.Assert.assertThat;

import java.util.ArrayList;
import java.util.List;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.test.IntegrationTestSupport;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
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

    private static Matcher<? super List<SearchableSubscriptionEntry>> isInDescendingOrdering() {
        return new TypeSafeMatcher<List<SearchableSubscriptionEntry>>() {
            @Override
            public void describeTo(Description description) {
                description.appendText("descending order");
            }

            @Override
            protected void describeMismatchSafely(final List<SearchableSubscriptionEntry> item, final Description mismatchDescription) {
                final List<Long> ids = new ArrayList<>();
                for ( SearchableSubscriptionEntry entry : item ) {
                    ids.add(entry.getId());
                }
                mismatchDescription.appendValueList("[", ",", "]", ids);
            }

            @Override
            protected boolean matchesSafely(List<SearchableSubscriptionEntry> item) {
                for ( int i = 0; i < item.size() - 1; i++ ) {
                    if ( item.get(i).getId() <= item.get(i + 1).getId() ) {
                        return false;
                    }
                }
                return true;
            }
        };
    }
}
