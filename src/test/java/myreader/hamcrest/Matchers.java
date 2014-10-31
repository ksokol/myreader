package myreader.hamcrest;

import java.util.ArrayList;
import java.util.List;

import myreader.entity.Identifiable;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;

/**
 * @author Kamill Sokol
 */
public final class Matchers {
    private Matchers() {
        //empty
    }

    public static Matcher<? super List<? extends Identifiable>> isInDescendingOrdering() {
        return new TypeSafeMatcher<List<? extends Identifiable>>() {
            @Override
            public void describeTo(Description description) {
                description.appendText("descending order");
            }

            @Override
            protected void describeMismatchSafely(final List<? extends Identifiable> item, final Description mismatchDescription) {
                final List<Long> ids = new ArrayList<>();
                for ( Identifiable entry : item ) {
                    ids.add(entry.getId());
                }
                mismatchDescription.appendValueList("[", ",", "]", ids);
            }

            @Override
            protected boolean matchesSafely(List<? extends Identifiable> item) {
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
