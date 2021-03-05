package myreader.fetcher.persistence;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class FetcherEntryTest {

  @Test
  void shouldTrimLeadingAndTrailingWhitespaces() {
    assertThat(fetchEntryWithTitle(" text text ").getTitle())
      .isEqualTo("text text");
  }

  @Test
  void shouldReplaceWhitespacesWithSingleBlank() {
    assertThat(fetchEntryWithTitle("1  2 \n 3 \r\n 4 \t 5").getTitle())
      .isEqualTo("1 2 3 4 5");
  }

  @Test
  void shouldUnescapeHtmlEntities() {
    assertThat(fetchEntryWithTitle("&amp; &gt; &lt;").getTitle())
      .isEqualTo("& > <");
  }

  @Test
  void shouldRemoveHtmlElements() {
    assertThat(fetchEntryWithTitle("<div><strong>1</strong><b>2</b></div>").getTitle())
      .isEqualTo("12");
  }

  @Test
  void shouldRemoveXhtmlElementsFromTitle() {
    String raw = "<xhtml:div xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n" +
      "    Less: <xhtml:em> &lt; </xhtml:em>\n" +
      "  </xhtml:div>";

    assertThat(fetchEntryWithTitle(raw).getTitle())
      .isEqualTo("Less: <");
  }

  @Test
  void shouldReturnEmptyTitleWhenValueIsNull() {
    assertThat(fetchEntryWithTitle(null).getTitle())
      .isEmpty();
  }

  @Test
  void shouldNotUnescapeHtmlEntities() {
    assertThat(fetchEntryWithContent("&amp;").getContent())
      .isEqualTo("&amp;");
  }

  @Test
  void shouldAllowHtmlElements() {
    assertThat(fetchEntryWithContent("<p>1</p><div>2</div><table></table>").getContent())
      .isEqualTo("<p>1</p><div>2</div><table></table>");
  }

  @Test
  void shouldRemoveHrefTagWithRelativeUrl() {
    assertThat(fetchEntryWithContent("<a href=\"/test.html\">...</a>").getContent())
      .isEqualTo("...");
  }

  @Test
  void shouldAllowHrefWithAbsoluteInsecureUrl() {
    assertThat(fetchEntryWithContent("<a href=\"http://example.com/test.html\">...</a>").getContent())
      .startsWith("<a href=\"http://example.com/test.html\"");
  }

  @Test
  void shouldAllowHrefWithAbsoluteSecureUrl() {
    assertThat(fetchEntryWithContent("<a href=\"https://example.com/test.html\">...</a>").getContent())
      .startsWith("<a href=\"https://example.com/test.html\"");
  }

  @Test
  void shouldAppendTargetAndRelAttributesToHref() {
    assertThat(fetchEntryWithContent("<a href=\"http://example.com/test.html\">...</a>").getContent())
      .isEqualTo("<a href=\"http://example.com/test.html\" target=\"_blank\" rel=\"noopener noreferrer\">...</a>");
  }

  @Test
  void shouldOverrideTargetAttributeOnHrefTag() {
    assertThat(fetchEntryWithContent("<a href=\"http://example.com/test.html\" target=\"other\">...</a>").getContent())
      .isEqualTo("<a href=\"http://example.com/test.html\" target=\"_blank\" rel=\"noopener noreferrer\">...</a>");
  }

  @Test
  void shouldOverrideRelAttributeOnHrefTag() {
    assertThat(fetchEntryWithContent("<a href=\"http://example.com/test.html\" rel=\"other\">...</a>").getContent())
      .isEqualTo("<a href=\"http://example.com/test.html\" target=\"_blank\" rel=\"noopener noreferrer\">...</a>");
  }

  @Test
  void shouldRemoveImageTagWithRelativeUrl() {
    assertThat(fetchEntryWithContent("<img src=\"/example.com/test.html\"></a>").getContent())
      .isEmpty();
  }

  @Test
  void shouldDisallowImageTagWithInsecureUrl() {
    assertThat(fetchEntryWithContent("<img src=\"http://example.com/test.html\"></img>").getContent())
      .isEmpty();
  }

  @Test
  void shouldRemoveWidthAndHeightAttributesFromImage() {
    assertThat(fetchEntryWithContent("<img width=\"800\" height=\"600\" alt=\"alt text\" src=\"https://example.com\"></img>").getContent())
      .doesNotContain("width", "height");
  }

  @Test
  void shouldAllowImageTagWithSecureUrl() {
    assertThat(
      fetchEntryWithContent("<img alt=\"alt text\" src=\"https://example.com/test.html\"></img>").getContent()
    ).containsSequence("src=\"https://example.com/test.html\" ");
  }

  @Test
  void shouldRemoveJavascript() {
    assertThat(fetchEntryWithContent("string <script>alert('')</script> string").getContent())
      .isEqualTo("string  string");
  }

  @Test
  void shouldReturnEmptyContentWhenValueIsNull() {
    assertThat(fetchEntryWithContent(null).getContent())
      .isEmpty();
  }

  @Test
  void shouldRemoveXhtmlElementsFromContent() {
    assertThat(fetchEntryWithContent("<xhtml:div xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">Less: <xhtml:em> &lt; </xhtml:em></xhtml:div>").getContent())
      .isEqualTo("Less:  &lt; ");
  }

  @Test
  void shouldReplaceTab() {
    String raw = "test\ttest1";

    assertThat(fetchEntryWithContent(raw).getContent())
      .isEqualTo("test    test1");
  }

  @Test
  void shouldAllowStyling() {
    assertThat(fetchEntryWithContent("<h2 style=\"color:red\">1</h2><span style=\"color:red\">3</span><div style=\"color:red\">4</div>").getContent())
      .isEqualTo("<h2 style=\"color:red\">1</h2><span style=\"color:red\">3</span><div style=\"color:red\">4</div>");
  }

  @Test
  void shouldAllowStylingIgnoringWidthAndHeight() {
    assertThat(fetchEntryWithContent("<h2 style=\"color:red; width:1px;height:2px\">1</h2>").getContent())
      .isEqualTo("<h2 style=\"color:red\">1</h2>");
  }

  @Test
  void shouldAllowPreCodeAndFigureHtmlElements() {
    assertThat(fetchEntryWithContent("<pre><code>text</code></pre><figure></figure>").getContent())
      .isEqualTo("<pre><code>text</code></pre><figure></figure>");
  }

  @Test
  void shouldAppendLoadingAttributeToImg() {
    assertThat(fetchEntryWithContent("<img src=\"https://example.com/test.html\">...</a>").getContent())
      .containsSequence("loading=\"lazy\"");
  }

  @Test
  void shouldAppendLoadingAttributeToImgOnce() {
    assertThat(fetchEntryWithContent("<img loading=\"lazy\" src=\"https://example.com/test.html\">...</a>").getContent())
      .matches(".*(loading=\"lazy\"){1}.*");
  }

  @Test
  void shouldReplaceLineBreaks() {
    assertThat(fetchEntryWithContent("text\r\ntext1\n\ntext2\ntext2").getContent())
      .isEqualTo("text<br>text1<br><br>text2<br>text2");
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
