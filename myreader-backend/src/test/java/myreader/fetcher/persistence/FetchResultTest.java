package myreader.fetcher.persistence;

import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import org.junit.Test;

import java.util.Collections;

/**
 * @author Kamill Sokol
 */
public class FetchResultTest {

    @Test
    public void testEquals() {
        final FetchResult first = new FetchResult("irrelevant");

        assertThat(first.equals(new Object()), is(false));
    }

    @Test
    public void testEquals1() {
        final FetchResult first = new FetchResult("irrelevant");

        assertThat(first.equals(first), is(true));
    }

    @Test
    public void testEquals3() {
        final FetchResult first = new FetchResult("irrelevant");
        final Object other = null;

        assertThat(first.equals(other), is(false));
    }

    @Test
    public void testHashCode() {
        final FetchResult first = new FetchResult("irrelevant");
        final FetchResult second = new FetchResult("irrelevant");

        assertThat(first.hashCode(), is(second.hashCode()));
    }

    @Test
    public void shouldTrimLeadingAndTrailingWhitespaces() {
        assertThat(fetchResultWithTitle(" text text ").getTitle(), is("text text"));
    }

    @Test
    public void shouldReplaceWhitespacesWithSingleBlank() {
        assertThat(fetchResultWithTitle("1  2 \n 3 \r\n 4 \t 5").getTitle(), is("1 2 3 4 5"));
    }

    @Test
    public void shouldUnescapeHtmlEntities() {
        assertThat(fetchResultWithTitle("&amp; &gt; &lt;").getTitle(), is("& > <"));
    }

    @Test
    public void shouldRemoveHtmlElements() {
        assertThat(fetchResultWithTitle("<div><strong>1</strong><b>2</b></div>").getTitle(), is("12"));
    }

    @Test
    public void shouldRemoveXhtmlElements() {
        String raw = "<xhtml:div xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n" +
                "      Less: <xhtml:em> &lt; </xhtml:em>\n" +
                "    </xhtml:div>";

        assertThat(fetchResultWithTitle(raw).getTitle(), is("Less: <"));
    }

    @Test
    public void shouldReturnEmptyWhenValueIsNull() {
        assertThat(fetchResultWithTitle(null).getTitle(), is(EMPTY));
    }

    private static FetchResult fetchResultWithTitle(String title) {
        return new FetchResult(Collections.emptyList(), null, title, null, 0);
    }
}
