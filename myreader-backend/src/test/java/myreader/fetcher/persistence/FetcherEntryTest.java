package myreader.fetcher.persistence;

import org.junit.Test;

import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
public class FetcherEntryTest {

    @Test
    public void shouldTrimLeadingAndTrailingWhitespaces() {
        assertThat(fetchEntryWithTitle(" text text ").getTitle(), is("text text"));
    }

    @Test
    public void shouldReplaceWhitespacesWithSingleBlank() {
        assertThat(fetchEntryWithTitle("1  2 \n 3 \r\n 4 \t 5").getTitle(), is("1 2 3 4 5"));
    }

    @Test
    public void shouldUnescapeHtmlEntities() {
        assertThat(fetchEntryWithTitle("&amp; &gt; &lt;").getTitle(), is("& > <"));
    }

    @Test
    public void shouldRemoveHtmlElements() {
        assertThat(fetchEntryWithTitle("<div><strong>1</strong><b>2</b></div>").getTitle(), is("12"));
    }

    @Test
    public void shouldRemoveXhtmlElementsFromTitle() {
        String raw = "<xhtml:div xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n" +
                "    Less: <xhtml:em> &lt; </xhtml:em>\n" +
                "  </xhtml:div>";

        assertThat(fetchEntryWithTitle(raw).getTitle(), is("Less: <"));
    }

    @Test
    public void shouldReturnEmptyTitleWhenValueIsNull() {
        assertThat(fetchEntryWithTitle(null).getTitle(), is(EMPTY));
    }

    @Test
    public void shouldNotUnescapeHtmlEntities() {
        assertThat(fetchEntryWithContent("&amp;").getContent(), is("&amp;"));
    }

    @Test
    public void shouldAllowHtmlElements() {
        assertThat(
                fetchEntryWithContent("<p>1</p><div>2</div><table></table>").getContent(),
                is("<p>1</p><div>2</div><table></table>")
        );
    }

    @Test
    public void shouldRemoveHrefTagWithRelativeUrl() {
        assertThat(fetchEntryWithContent("<a href=\"/test.html\">...</a>").getContent(), is("..."));
    }

    @Test
    public void shouldAllowHrefWithAbsoluteInsecureUrl() {
        assertThat(
                fetchEntryWithContent("<a href=\"http://example.com/test.html\">...</a>").getContent(),
                startsWith("<a href=\"http://example.com/test.html\"")
        );
    }

    @Test
    public void shouldAllowHrefWithAbsoluteSecureUrl() {
        assertThat(
                fetchEntryWithContent("<a href=\"https://example.com/test.html\">...</a>").getContent(),
                startsWith("<a href=\"https://example.com/test.html\"")
        );
    }

    @Test
    public void shouldAppendTargetAndRelAttributesToHref() {
        assertThat(
                fetchEntryWithContent("<a href=\"http://example.com/test.html\">...</a>").getContent(),
                is("<a href=\"http://example.com/test.html\" target=\"_blank\" rel=\"noopener noreferrer\">...</a>")
        );
    }

    @Test
    public void shouldOverrideTargetAttributeOnHrefTag() {
        assertThat(
                fetchEntryWithContent("<a href=\"http://example.com/test.html\" target=\"other\">...</a>").getContent(),
                is("<a href=\"http://example.com/test.html\" target=\"_blank\" rel=\"noopener noreferrer\">...</a>")
        );
    }

    @Test
    public void shouldOverrideRelAttributeOnHrefTag() {
        assertThat(
                fetchEntryWithContent("<a href=\"http://example.com/test.html\" rel=\"other\">...</a>").getContent(),
                is("<a href=\"http://example.com/test.html\" target=\"_blank\" rel=\"noopener noreferrer\">...</a>")
        );
    }

    @Test
    public void shouldRemoveImageTagWithRelativeUrl() {
        assertThat(fetchEntryWithContent("<img src=\"/example.com/test.html\"></a>").getContent(), is(""));
    }

    @Test
    public void shouldAllowImageTagWithInsecureUrl() {
        assertThat(
                fetchEntryWithContent("<img src=\"http://example.com/test.html\"></img>").getContent(),
                is("<img src=\"http://example.com/test.html\" />")
        );
    }

    @Test
    public void shouldRemoveWidthAndHeightAttributesFromImage() {
        assertThat(
                fetchEntryWithContent("<img width=\"800\" height=\"600\" alt=\"alt text\" src=\"http://example.com\"></img>").getContent(),
                is("<img alt=\"alt text\" src=\"http://example.com\" />")
        );
    }

    @Test
    public void shouldAllowImageTagWithSecureUrl() {
        assertThat(
                fetchEntryWithContent("<img alt=\"alt text\" src=\"https://example.com/test.html\"></img>").getContent(),
                is("<img alt=\"alt text\" src=\"https://example.com/test.html\" />")
        );
    }

    @Test
    public void shouldRemoveJavascript() {
        assertThat(fetchEntryWithContent("string <script>alert('')</script> string").getContent(), is("string  string"));
    }

    @Test
    public void shouldReturnEmptyContentWhenValueIsNull() {
        assertThat(fetchEntryWithContent(null).getContent(), is(EMPTY));
    }

    @Test
    public void shouldRemoveXhtmlElementsFromContent() {
        String raw = "<xhtml:div xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">Less: <xhtml:em> &lt; </xhtml:em></xhtml:div>";

        assertThat(fetchEntryWithContent(raw).getContent(), is("Less:  &lt; "));
    }

    @Test
    public void shouldRetainWhitespaces() {
        String raw = "\ntest\ttest1\ntest2\ntest3  test4";

        assertThat(fetchEntryWithContent(raw).getContent(), is("\ntest\ttest1\ntest2\ntest3  test4"));
    }

    @Test
    public void shouldAllowStyling() {
        assertThat(
                fetchEntryWithContent("<h2 style=\"color:red\">1</h2><span style=\"color:red\">3</span><div style=\"color:red\">4</div>").getContent(),
                is("<h2 style=\"color:red\">1</h2><span style=\"color:red\">3</span><div style=\"color:red\">4</div>")
        );
    }

    @Test
    public void shouldAllowPreCodeAndFigureHtmlElements() {
        assertThat(
                fetchEntryWithContent("<pre><code>text</code></pre><figure></figure>").getContent(),
                is("<pre><code>text</code></pre><figure></figure>")
        );
    }

    private static FetcherEntry fetchEntryWithTitle(String title) {
        FetcherEntry entry = new FetcherEntry();
        entry.setTitle(title);
        return entry;
    }

    private static FetcherEntry fetchEntryWithContent(String content) {
        FetcherEntry entry = new FetcherEntry();
        entry.setContent(content);
        return entry;
    }
}
