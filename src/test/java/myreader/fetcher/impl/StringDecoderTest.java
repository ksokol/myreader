package myreader.fetcher.impl;

import myreader.fetcher.impl.StringDecoder;
import org.junit.Test;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

/**
 * @author Kamill Sokol
 */
public class StringDecoderTest {

    @Test
    public void testNull() {
        String decoded = StringDecoder.escapeHtmlContent(null, null);
        assertThat(decoded, is(""));
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

	//@Test
	public void testEscapeHTML1() {
		assertTrue("&lt;p&gt; tag &lt;/p&gt;".equals(StringDecoder.escapeHtml("<p> tag </p>")));
	}

	/*
	@Test
	public void testEscapeHTMLWithCR1() {
		assertTrue("string string".equals(StringDecoder.eliminateWhitespace("string\r\nstring")));
	}

	@Test
	public void testEscapeHTMLWithCR2() {
		assertTrue("string string".equals(StringDecoder.eliminateWhitespace("string\nstring")));
	}

	@Test
	public void testEscapeHTMLNormalizeWhitespace() {
		assertTrue("string string".equals(StringDecoder.normalize("  string    string ")));
	}

	@Test
	public void testEscapeHTMLRemoveStyle1() {
		assertTrue("style=\"some directive;\"".equals(StringDecoder.eliminateCssStyle("style=\"some directive;clear: both;\"")));
	}

	@Test
	public void testEscapeHTMLRemoveStyle2() {
		assertTrue("style=\"some directive;\"".equals(StringDecoder.eliminateCssStyle("style=\"some directive;clear:both;\"")));
	}

	@Test
	public void testEscapeHTMLRemoveStyle3() {
		assertTrue("style=\"some directive;\"".equals(StringDecoder.eliminateCssStyle("style=\"some directive;clear: left;\"")));
	}

	@Test
	public void testEscapeHTMLRemoveStyle4() {
		assertTrue("style=\"some directive;\"".equals(StringDecoder.eliminateCssStyle("style=\"some directive;float: left;\"")));
	}
	 */
	@Test
	public void testEscapeHTMLRemoveJavascript1() {
		assertTrue("string   string".equals(StringDecoder.eliminateJavascript("string <script>alert('')</script> string")));
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

	//@Test
	public void testEscapeHTMLRemoveJavascript5() {
		assertTrue("ein \\\\&".equals(StringDecoder.escapeForJson("ein \\&")));
	}

	@Test
	public void testEscapeHTMLWithNotNull() {
		assertTrue("".equals(StringDecoder.escapeHtmlContent("string",null)));
	}

	@Test
	public void testEscapeHTMLWithNull() {
		assertTrue("".equals(StringDecoder.escapeHtmlContent(null,null)));
	}
}
