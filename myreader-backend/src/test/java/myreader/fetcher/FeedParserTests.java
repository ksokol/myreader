package myreader.fetcher;

import junit.framework.AssertionFailedError;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.resttemplate.SyndicationRestTemplateConfiguration;
import org.junit.Before;
import org.junit.Test;
import org.mockito.hamcrest.MockitoHamcrest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;

import static junit.framework.TestCase.fail;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
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

/**
 * @author Kamill Sokol
 */
public class FeedParserTests {

    private static final String HTTP_EXAMPLE_COM = "http://example.com";

    private FeedParser parser;
    private ApplicationEventPublisher eventPublisher;
    private MockRestServiceServer mockServer;

    @Before
    public void beforeTest() throws NoSuchAlgorithmException, KeyStoreException, KeyManagementException {
        RestTemplate syndicationRestTemplate = new SyndicationRestTemplateConfiguration().syndicationRestTemplate();
        eventPublisher = mock(ApplicationEventPublisher.class);
        mockServer = MockRestServiceServer.createServer(syndicationRestTemplate);
        parser = new FeedParser(syndicationRestTemplate, eventPublisher);
    }

    @Test
    public void testFeed1() {
        mockServer.expect(requestTo(HTTP_EXAMPLE_COM)).andExpect(method(GET))
                .andRespond(withSuccess(new ClassPathResource("rss/feed1.xml"), TEXT_XML));

        FetchResult result = parser.parse(HTTP_EXAMPLE_COM).orElseThrow(AssertionFailedError::new);
        assertThat(result.getEntries(), hasSize(2));
        assertThat(result.getResultSizePerFetch(), is(2));
    }

    @Test
    public void testFeed2() {
        mockServer.expect(requestTo(HTTP_EXAMPLE_COM)).andExpect(method(GET))
                .andRespond(withSuccess(new ClassPathResource("rss/feed2.xml"), TEXT_XML));

        FetchResult result = parser.parse(HTTP_EXAMPLE_COM).orElseThrow(AssertionFailedError::new);
        assertThat(result.getEntries(), hasItems(
                hasProperty("url", is("http://www.javaspecialists.eu/archive/Issue217.html")),
                hasProperty("url", is("http://www.javaspecialists.eu/archive/Issue217b.html"))
        ));
    }

    @Test
    public void testFeed3() {
        mockServer.expect(requestTo(HTTP_EXAMPLE_COM)).andExpect(method(GET))
                .andRespond(withSuccess(new ClassPathResource("rss/feed3.xml"), TEXT_XML));

        FetchResult result = parser.parse(HTTP_EXAMPLE_COM).orElseThrow(AssertionFailedError::new);
        assertThat(result.getEntries(), hasItems(
                hasProperty("url", is(HTTP_EXAMPLE_COM + "/12539.htm")),
                hasProperty("url", is(HTTP_EXAMPLE_COM + "/12673.htm"))
        ));
    }

    @Test
    public void testFeed4() {
        mockServer.expect(requestTo("https://github.com/ksokol.private.atom")).andExpect(method(GET))
                .andRespond(withSuccess(new ClassPathResource("rss/feed4.xml"), TEXT_XML));

        FetchResult result = parser.parse("https://github.com/ksokol.private.atom")
                .orElseThrow(AssertionFailedError::new);
        assertThat(result.getEntries(), hasItem(
                hasProperty("content", containsString(" Have a look through "))
        ));
    }

    @Test
    public void testFeed5() {
        mockServer.expect(requestTo("http://neusprech.org/feed/")).andExpect(method(GET))
                .andRespond(withSuccess(new ClassPathResource("rss/feed5.xml"), TEXT_XML));

        FetchResult result = parser.parse("http://neusprech.org/feed/")
                .orElseThrow(AssertionFailedError::new);
        assertThat(result.getEntries(), hasItem(
                hasProperty("content", startsWith("Ein Gastbeitrag von Erik W. Ende Juni 2014 sagte"))
        ));
    }

    @Test
    public void testFeed7() {
        mockServer.expect(requestTo(HTTP_EXAMPLE_COM)).andExpect(method(GET))
                .andRespond(withSuccess(new ClassPathResource("rss/feed2.xml"), TEXT_XML));

        FetchResult result = parser.parse(HTTP_EXAMPLE_COM).orElseThrow(AssertionFailedError::new);
        assertThat(result.getEntries(), hasItem(
                hasProperty("url", is("http://www.javaspecialists.eu/archive/Issue220b.html"))
        ));
    }

    @Test
    public void shouldReturnEmptyOptionalWhenResourceIsNotModified() {
        mockServer.expect(requestTo("/irrelevant")).andExpect(method(GET))
                .andExpect(header("If-Modified-Since", is("lastModified")))
                .andRespond(withStatus(HttpStatus.NOT_MODIFIED));

        assertThat(parser.parse("/irrelevant", "lastModified").isPresent(), is(false));
    }

    @Test
    public void testFeed9() {
        mockServer.expect(requestTo("/irrelevant")).andExpect(method(GET))
                .andExpect(header("User-Agent", startsWith("Mozilla")))
                .andRespond(withStatus(HttpStatus.NOT_MODIFIED));

        parser.parse("/irrelevant", "lastModified");
    }

    @Test
    public void testInvalidCharacter() {
        // test [^\u0020-\uD7FF]+
        mockServer.expect(requestTo(HTTP_EXAMPLE_COM)).andExpect(method(GET))
                .andRespond(withSuccess(new ClassPathResource("rss/feed7.xml"), TEXT_XML));

        FetchResult result = parser.parse(HTTP_EXAMPLE_COM).orElseThrow(AssertionFailedError::new);
        assertThat(result.getEntries(), hasSize(6));
    }

    @Test
    public void shouldExtractFromResponseWithTextPlainContentType() {
        String url = "https://example.com/path-with-extension.rss";

        mockServer.expect(requestTo(url)).andExpect(method(GET))
                .andRespond(withSuccess(new ClassPathResource("rss/feed7.xml"), TEXT_PLAIN));

        FetchResult result = parser.parse(url).orElseThrow(AssertionFailedError::new);

        assertThat(result.getEntries(), hasSize(greaterThan(0)));
    }

    @Test
    public void shouldExtractFromResponseWithTextXmlContentType() {
        String url = "https://example.com/path-with-extension.rss";

        mockServer.expect(requestTo(url)).andExpect(method(GET))
                .andRespond(withSuccess(new ClassPathResource("rss/feed7.xml"), TEXT_XML));

        FetchResult result = parser.parse(url).orElseThrow(AssertionFailedError::new);

        assertThat(result.getEntries(), hasSize(greaterThan(0)));
    }

    @Test
    public void shouldExtractFromResponseWithTextHtmlContentType() {
        String url = "https://example.com/path-without-extension";

        mockServer.expect(requestTo(url)).andExpect(method(GET))
                .andRespond(withSuccess(new ClassPathResource("rss/feed7.xml"), TEXT_HTML));

        FetchResult result = parser.parse(url).orElseThrow(AssertionFailedError::new);

        assertThat(result.getEntries(), hasSize(greaterThan(0)));
    }

    @Test
    public void testPublishFetchErrorEvent() {
        mockServer.expect(requestTo(HTTP_EXAMPLE_COM)).andExpect(method(GET))
                .andRespond(withServerError().body("test"));

        try {
            parser.parse(HTTP_EXAMPLE_COM);
            fail("expected exception not thrown");
        } catch (FeedParseException exception) {
            verify(eventPublisher).publishEvent(MockitoHamcrest.argThat(
                    allOf(
                            hasProperty("source", is(HTTP_EXAMPLE_COM)),
                            hasProperty("errorMessage", is("500 Internal Server Error")),
                            hasProperty("timestamp", is(greaterThan(0L)))
                    )));
        }
    }

    @Test
    public void shouldReturnEmptyOptionalWhenResponseBodyIsEmpty() {
        mockServer.expect(requestTo("/irrelevant")).andExpect(method(GET))
                .andRespond(withSuccess());

        assertThat(parser.parse("/irrelevant").isPresent(), is(false));
    }
}
