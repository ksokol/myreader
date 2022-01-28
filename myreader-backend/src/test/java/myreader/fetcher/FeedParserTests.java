package myreader.fetcher;

import myreader.test.WithTestProperties;
import org.apache.commons.io.IOUtils;
import org.apache.commons.io.input.BOMInputStream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.opentest4j.AssertionFailedError;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.MediaType.TEXT_HTML;
import static org.springframework.http.MediaType.TEXT_PLAIN;
import static org.springframework.http.MediaType.TEXT_XML;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@WithTestProperties
class FeedParserTests {

  private static final String URL = "http://example.com";

  private MockRestServiceServer mockServer;

  @Autowired
  private RestTemplate syndicationRestTemplate;

  @Autowired
  private FeedParser parser;

  @BeforeEach
  void setUp() {
    mockServer = MockRestServiceServer.createServer(syndicationRestTemplate);
  }

  @Test
  void shouldHandleAtom() {
    mockServer.expect(requestTo(URL)).andExpect(method(GET))
      .andRespond(withSuccess(new ClassPathResource("rss/feed1.xml"), TEXT_XML));

    assertThat(parser.parse(URL).orElseThrow(AssertionFailedError::new))
      .hasFieldOrPropertyWithValue("resultSizePerFetch", 2)
      .extracting("entries").asList()
      .extracting("url")
      .containsExactly("http://www.heise.de/newsticker/meldung/1180071.html", "http://www.heise.de/newsticker/meldung/1180079.html");
  }

  @Test
  void shouldHandleRss() {
    mockServer.expect(requestTo(URL)).andExpect(method(GET))
      .andRespond(withSuccess(new ClassPathResource("rss/feed2.xml"), TEXT_XML));

    assertThat(parser.parse(URL).orElseThrow(AssertionFailedError::new))
      .hasFieldOrPropertyWithValue("resultSizePerFetch", 2)
      .extracting("entries").asList()
      .extracting("url")
      .containsExactly("http://www.javaspecialists.eu/archive/Issue217.html", "http://www.javaspecialists.eu/archive/Issue217b.html");
  }

  @Test
  void shouldSanitizeEntryUrl() {
    mockServer.expect(requestTo(URL)).andExpect(method(GET))
      .andRespond(withSuccess(new ClassPathResource("rss/feed3.xml"), TEXT_XML));

    assertThat(parser.parse(URL).orElseThrow(AssertionFailedError::new))
      .extracting("entries").asList()
      .extracting("url")
      .containsExactly(URL + "/12539.htm", URL + "/12673.htm");
  }

  @Test
  void shouldHandleAtomWithHtmlContent() {
    mockServer.expect(requestTo(URL)).andExpect(method(GET))
      .andRespond(withSuccess(new ClassPathResource("rss/feed4.xml"), TEXT_XML));

    assertThat(parser.parse(URL).orElseThrow(AssertionFailedError::new))
      .extracting("entries").asList()
      .element(0)
      .extracting("content").asString()
      .containsSequence(" Have a look through ");
  }

  @Test
  void shouldHandleRssIgnoringAdditionalNamespaces() {
    var url = URL + "/feed.atom";

    mockServer.expect(requestTo(url)).andExpect(method(GET))
      .andRespond(withSuccess(new ClassPathResource("rss/feed5.xml"), TEXT_XML));

    assertThat(parser.parse(url).orElseThrow(AssertionFailedError::new))
      .extracting("entries").asList()
      .element(0)
      .extracting("content").asString()
      .containsSequence("<p><em>Ein Gastbeitrag von Erik W.</em></p>");
  }

  @Test
  void shouldReturnEmptyOptionalWhenResourceIsNotModified() {
    mockServer.expect(requestTo(URL)).andExpect(method(GET))
      .andExpect(header("If-Modified-Since", is("lastModified")))
      .andRespond(withStatus(HttpStatus.NOT_MODIFIED));

    assertThat(parser.parse(URL, "lastModified"))
      .isNotPresent();
  }

  @Test
  void shouldFakeUserAgent() {
    mockServer.expect(requestTo(URL)).andExpect(method(GET))
      .andExpect(header("User-Agent", startsWith("Mozilla")))
      .andRespond(withStatus(HttpStatus.NOT_MODIFIED));

    parser.parse(URL, "lastModified");
  }

  @Test
  void shouldFilterInvalidCharacters() throws IOException {
    var classPathResource = new ClassPathResource("rss/feed7.xml");
    var invalidXml = IOUtils.toString(classPathResource.getInputStream(), StandardCharsets.UTF_8);

    assertThat(invalidXml)
      .containsSequence("");

    mockServer.expect(requestTo(URL)).andExpect(method(GET))
      .andRespond(withSuccess(classPathResource, TEXT_XML));

    assertThat(parser.parse(URL).orElseThrow(AssertionFailedError::new))
      .extracting("entries").asList()
      .hasSizeGreaterThan(0);
  }

  @Test
  void shouldExtractFromResponseWithTextPlainContentType() {
    var url = URL + "/feed.rss";

    mockServer.expect(requestTo(url)).andExpect(method(GET))
      .andRespond(withSuccess(new ClassPathResource("rss/feed7.xml"), TEXT_PLAIN));

    assertThat(parser.parse(url).orElseThrow(AssertionFailedError::new))
      .extracting("entries").asList()
      .hasSizeGreaterThan(0);
  }

  @Test
  void shouldExtractFromResponseWithTextXmlContentType() {
    var url = URL + "/feed.rss";

    mockServer.expect(requestTo(url)).andExpect(method(GET))
      .andRespond(withSuccess(new ClassPathResource("rss/feed7.xml"), TEXT_XML));

    assertThat(parser.parse(url).orElseThrow(AssertionFailedError::new))
      .extracting("entries").asList()
      .hasSizeGreaterThan(0);
  }

  @Test
  void shouldExtractFromResponseWithTextHtmlContentType() {
    mockServer.expect(requestTo(URL)).andExpect(method(GET))
      .andRespond(withSuccess(new ClassPathResource("rss/feed7.xml"), TEXT_HTML));

    assertThat(parser.parse(URL).orElseThrow(AssertionFailedError::new))
      .extracting("entries").asList()
      .hasSizeGreaterThan(0);
  }

  @Test
  void shouldThrowExceptionWhenServerRespondedWithError() {
    mockServer.expect(requestTo(URL)).andExpect(method(GET))
      .andRespond(withServerError().body("test"));

    var thrown = assertThrows(
      FeedParseException.class,
      () -> parser.parse(URL),
      "expected exception not thrown"
    );

    assertThat(thrown.getMessage()).isEqualTo("500 Internal Server Error: \"test\"");
  }

  @Test
  void shouldThrowExceptionWhenResponseBodyIsInvalid() {
    mockServer.expect(requestTo(URL)).andExpect(method(GET))
      .andRespond(withSuccess().body("test"));

    var thrown = assertThrows(
      FeedParseException.class,
      () -> parser.parse(URL),
      "expected exception not thrown"
    );

    assertThat(thrown.getMessage()).startsWith("Could not extract response: no suitable HttpMessageConverter");
  }

  @Test
  void shouldProcessSyndicationWithCorrectCharset() throws IOException {
    var classPathResource = new ClassPathResource("rss/feed8.xml");
    var iso8859EncodedXml = IOUtils.toString(classPathResource.getInputStream(), StandardCharsets.UTF_8);

    assertThat(iso8859EncodedXml)
      .containsSequence("���");

    mockServer.expect(requestTo(URL)).andExpect(method(GET))
      .andRespond(withSuccess(classPathResource, TEXT_HTML));

    assertThat(parser.parse(URL).orElseThrow(AssertionFailedError::new))
      .extracting("entries").asList()
      .element(0)
      .extracting("content").asString()
      .containsSequence("feed8 content with umlaut äöü");
  }

  @Test
  void shouldHandleResponseWithBOM() throws IOException {
    var classPathResource = new ClassPathResource("rss/feed9.xml");

    try (var xmlWithBOM = new BOMInputStream(classPathResource.getInputStream())) {
      assertThat(xmlWithBOM.hasBOM())
        .isTrue();

      mockServer.expect(requestTo(URL)).andExpect(method(GET))
        .andRespond(withSuccess(classPathResource, TEXT_HTML));

      assertThat(parser.parse(URL).orElseThrow(AssertionFailedError::new))
        .extracting("entries").asList()
        .isNotEmpty();
    }
  }

  @Test
  void shouldNotFailIfResponseBodyIsEmpty() {
    mockServer.expect(requestTo(URL)).andExpect(method(GET))
      .andRespond(withSuccess());

    assertThat(parser.parse(URL))
      .isNotPresent();
  }

  @Test
  void shouldNotFailIfResponseIsEmptyString() {
    mockServer.expect(requestTo(URL)).andExpect(method(GET))
      .andRespond(withSuccess().body(""));

    assertThat(parser.parse(URL))
      .isNotPresent();
  }
}
