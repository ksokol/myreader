package myreader.fetcher;

import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.resttemplate.FeedParserConfiguration;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

import static junit.framework.TestCase.fail;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.Assert.assertThat;
import static org.springframework.http.HttpMethod.GET;
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
@RunWith(SpringRunner.class)
@SpringBootTest(classes = FeedParserConfiguration.class)
@RestClientTest
public class FeedParserTest {

    private static final String HTTP_EXAMPLE_COM = "http://example.com";

    @Autowired
    private RestTemplate syndicationRestTemplate;

    @Autowired
    private FeedParser parser;

    @Autowired
    private TestApplicationEventPublisher eventPublisher;

    private MockRestServiceServer mockServer;

    @Before
    public void beforeTest() throws Exception {
        mockServer = MockRestServiceServer.createServer(syndicationRestTemplate);
    }

    @Test
	public void testFeed1() throws Exception {
        mockServer.expect(requestTo(HTTP_EXAMPLE_COM)).andExpect(method(GET))
                .andRespond(withSuccess(new ClassPathResource("rss/feed1.xml"), TEXT_XML));

		FetchResult result = parser.parse(HTTP_EXAMPLE_COM);
		assertThat(result.getEntries(), hasSize(2));
		assertThat(result.getResultSizePerFetch(), is(2));
	}

	@Test
	public void testFeed2() throws Exception {
        mockServer.expect(requestTo(HTTP_EXAMPLE_COM)).andExpect(method(GET))
                .andRespond(withSuccess(new ClassPathResource("rss/feed2.xml"), TEXT_XML));

		FetchResult result = parser.parse(HTTP_EXAMPLE_COM);
		assertThat(result.getEntries(), hasItems(
                hasProperty("url", is("http://www.javaspecialists.eu/archive/Issue217.html")),
                hasProperty("url", is("http://www.javaspecialists.eu/archive/Issue217b.html"))
        ));
	}

	@Test
	public void testFeed3() throws Exception {
        mockServer.expect(requestTo(HTTP_EXAMPLE_COM)).andExpect(method(GET))
                .andRespond(withSuccess(new ClassPathResource("rss/feed3.xml"), TEXT_XML));

		FetchResult result = parser.parse(HTTP_EXAMPLE_COM);
		assertThat(result.getEntries(), hasItems(
				hasProperty("url", is(HTTP_EXAMPLE_COM + "/12539.htm")),
				hasProperty("url", is(HTTP_EXAMPLE_COM + "/12673.htm"))
		));
	}

    @Test
    public void testFeed4() throws Exception {
        mockServer.expect(requestTo("https://github.com/ksokol.private.atom")).andExpect(method(GET))
                .andRespond(withSuccess(new ClassPathResource("rss/feed4.xml"), TEXT_XML));

        FetchResult result = parser.parse("https://github.com/ksokol.private.atom");
        assertThat(result.getEntries(), hasItems(
                hasProperty("content", startsWith("<!-- issue_comment -->"))
        ));
    }

    @Test
    public void testFeed5() throws Exception {
        mockServer.expect(requestTo("http://neusprech.org/feed/")).andExpect(method(GET))
                .andRespond(withSuccess(new ClassPathResource("rss/feed5.xml"), TEXT_XML));

        FetchResult result = parser.parse("http://neusprech.org/feed/");
        assertThat(result.getEntries(), hasItems(
                hasProperty("content", startsWith("Ein Gastbeitrag von Erik W. Ende Juni 2014 sagte"))
        ));
    }

    @Test
    public void testFeed7() throws Exception {
        mockServer.expect(requestTo(HTTP_EXAMPLE_COM)).andExpect(method(GET))
                .andRespond(withSuccess(new ClassPathResource("rss/feed2.xml"), TEXT_XML));

        FetchResult result = parser.parse(HTTP_EXAMPLE_COM);
        assertThat(result.getEntries(), hasItems(
                hasProperty("url", is("http://www.javaspecialists.eu/archive/Issue220b.html"))
        ));
    }

    @Test
    public void testFeed8() throws Exception {
        mockServer.expect(requestTo("irrelevant")).andExpect(method(GET))
                .andExpect(header("If-Modified-Since", is("lastModified")))
                .andRespond(withStatus(HttpStatus.NOT_MODIFIED));

        FetchResult result = parser.parse("irrelevant", "lastModified");
        assertThat(result.getEntries(), empty());
    }

    @Test
    public void testFeed9() throws Exception {
        mockServer.expect(requestTo("irrelevant")).andExpect(method(GET))
                .andExpect(header("User-Agent", startsWith("Mozilla")))
                .andRespond(withStatus(HttpStatus.NOT_MODIFIED));

        parser.parse("irrelevant", "lastModified");
    }

    @Test
    public void testInvalidCharacter() throws Exception {
        // test [^\u0020-\uD7FF]+
        mockServer.expect(requestTo(HTTP_EXAMPLE_COM)).andExpect(method(GET))
                .andRespond(withSuccess(new ClassPathResource("rss/feed7.xml"), TEXT_XML));

        FetchResult result = parser.parse(HTTP_EXAMPLE_COM);
        assertThat(result.getEntries(), hasSize(6));
    }

    @Test
    public void testAdjustedResponseContentType() {
        String url = "https://feeds.feedwrench.com/AdventuresInAngular.rss";

        mockServer.expect(requestTo(url)).andExpect(method(GET))
                .andRespond(
                        withSuccess(new ClassPathResource("rss/feed7.xml"), TEXT_XML)
                        .contentType(MediaType.TEXT_PLAIN)
                );

        FetchResult result = parser.parse(url);

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
            // expected exception
        }

        assertThat(eventPublisher.receivedEvents, hasItem(
                allOf(
                        hasProperty("source", is(HTTP_EXAMPLE_COM)),
                        hasProperty("errorMessage", is("500 Internal Server Error")),
                        hasProperty("timestamp", is(greaterThan(0L)))
                ))
        );
    }

    @Primary
    @Component
    static class TestApplicationEventPublisher implements ApplicationEventPublisher {

        private List<ApplicationEvent> receivedEvents = new ArrayList<>();

        @Override
        public void publishEvent(ApplicationEvent event) {
            receivedEvents.add(event);
        }

        @Override
        public void publishEvent(Object event) {
            throw new UnsupportedOperationException();
        }
    }
}
