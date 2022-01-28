package myreader.fetcher.persistence;

import org.junit.jupiter.api.Test;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;

class FetchResultTest {

  @Test
  void testEquals() {
    assertThat(new FetchResult("irrelevant"))
      .isNotEqualTo(new Object());
  }

  @Test
  void testEquals1() {
    var first = new FetchResult("irrelevant");

    assertThat(new FetchResult("irrelevant"))
      .isEqualTo(first);
  }

  @Test
  void testEquals3() {
    assertThat(new FetchResult("irrelevant"))
      .isNotEqualTo(null);
  }

  @Test
  void testHashCode() {
    assertThat(new FetchResult("irrelevant").hashCode())
      .isEqualTo(new FetchResult("irrelevant").hashCode());
  }

  @Test
  void shouldTrimLeadingAndTrailingWhitespaces() {
    assertThat(fetchResultWithTitle(" text text ").getTitle())
      .isEqualTo("text text");
  }

  @Test
  void shouldReplaceWhitespacesWithSingleBlank() {
    assertThat(fetchResultWithTitle("1  2 \n 3 \r\n 4 \t 5").getTitle())
      .isEqualTo("1 2 3 4 5");
  }

  @Test
  void shouldUnescapeHtmlEntities() {
    assertThat(fetchResultWithTitle("&amp; &gt; &lt;").getTitle())
      .isEqualTo("& > <");
  }

  @Test
  void shouldRemoveHtmlElements() {
    assertThat(fetchResultWithTitle("<div><strong>1</strong><b>2</b></div>").getTitle())
      .isEqualTo("12");
  }

  @Test
  void shouldRemoveXhtmlElements() {
    var raw = "<xhtml:div xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n" +
      "      Less: <xhtml:em> &lt; </xhtml:em>\n" +
      "    </xhtml:div>";

    assertThat(fetchResultWithTitle(raw).getTitle())
      .isEqualTo("Less: <");
  }

  @Test
  void shouldReturnEmptyWhenValueIsNull() {
    assertThat(fetchResultWithTitle(null).getTitle())
      .isEmpty();
  }

  private static FetchResult fetchResultWithTitle(String title) {
    return new FetchResult(Collections.emptyList(), null, title, null, 0);
  }
}
