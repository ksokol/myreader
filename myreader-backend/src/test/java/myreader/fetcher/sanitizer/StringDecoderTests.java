package myreader.fetcher.sanitizer;

import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.isEmptyString;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

/**
 * @author Kamill Sokol
 */
public class StringDecoderTests {

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Test
    public void testNull() {
        String decoded = new StringDecoder().escapeHtmlContent(null, null);
        assertThat(decoded, is(EMPTY));
    }

    @Test
    public void eliminateRelativeImgException() {
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage("second parameter [invalid] not a valid ur");
        StringDecoder.eliminateRelativeUrls("irrelevant", "invalid");
    }

	@Test
	public void testEliminateRelativeImgTags1() {
		String html = "<img class=some src=\"/test.html\">...</img>";
		String decoded = StringDecoder.eliminateRelativeUrls(html, "http://feeds.feedburner.com/GrantLucene");
		assertTrue("<img class=some src=\"http://feeds.feedburner.com/test.html\">...</img>".equals(decoded));
	}

	@Test
	public void testEliminateRelativeImgTags2() {
		String html = "<a class=some href=\"/test.html\">link</a>";
		String decoded = StringDecoder.eliminateRelativeUrls(html, "http://feeds.feedburner.com/GrantLucene");
		assertTrue("<a class=some href=\"http://feeds.feedburner.com/test.html\">link</a>".equals(decoded));
	}
	@Test
	public void testEliminateRelativeImgTags3() {
		String html = "<a class=some href\"/test.html\">link</a>";
		String decoded = StringDecoder.eliminateRelativeUrls(html, "http://feeds.feedburner.com/GrantLucene");
		assertTrue("<a class=some href\"/test.html\">link</a>".equals(decoded));
	}

	@Test
	public void testEliminateRelativeImgTags4() {
		String html = "<a class=some href=\"#test.html\">link</a>";
		String decoded = StringDecoder.eliminateRelativeUrls(html, "http://feeds.feedburner.com/GrantLucene");
		assertTrue("<a class=some href=\"#test.html\">link</a>".equals(decoded));
	}

	@Test
	public void testEliminateRelativeImgTags6() {
		String html = "<a href=\"/blog/wp-content/uploads/2011/03/logo-front.png\"><img height=\"159\" width=\"240\" alt=\"\" src=\"/blog/wp-content/uploads/2011/03/logo-front-300x198.png\" title=\"logo-front\" style=\"border: 2px solid white;\" class=\"alignright size-medium wp-image-3278\"></a>";
		String decoded = StringDecoder.eliminateRelativeUrls(html, "http://example.com/");
		assertTrue("<a href=\"http://example.com/blog/wp-content/uploads/2011/03/logo-front.png\"><img height=\"159\" width=\"240\" alt=\"\" src=\"http://example.com/blog/wp-content/uploads/2011/03/logo-front-300x198.png\" title=\"logo-front\" style=\"border: 2px solid white;\" class=\"alignright size-medium wp-image-3278\"></a>".equals(decoded));
	}

	@Test
	public void testEscapeHTMLRemoveJavascript1() {
		assertThat(StringDecoder.eliminateJavascript("string <script>alert('')</script> string"), is("string   string"));
	}

	@Test
	public void testEscapeHTMLRemoveJavascript2() {
		assertTrue("string   string".equals(StringDecoder.eliminateJavascript("string <script>alert('')</script> string")));
	}

	@Test
	public void testEscapeHTMLRemoveJavascript3() {
		assertTrue("string   string".equals(StringDecoder.eliminateJavascript("string <script>alert('')</script> string")));
	}

	@Test
	public void testEscapeHTMLRemoveJavascript4() {
		assertTrue("string   string".equals(StringDecoder.eliminateJavascript("string <script>alert('')</script> string")));
	}

	@Test
	public void testEscapeHTMLWithNotNull() {
		assertThat(StringDecoder.escapeHtmlContent("string", null), is(EMPTY));
	}

	@Test
	public void testEscapeHTMLWithNull() {
		assertThat(StringDecoder.escapeHtmlContent(null,null), is(EMPTY));
	}

    @Test
    public void testEscapeSimpleHtmlWithNull() {
        assertThat(StringDecoder.escapeSimpleHtml(null), isEmptyString());
    }
}
