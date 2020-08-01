package myreader.fetcher.resttemplate;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.mock.http.client.MockClientHttpRequest;

import java.io.IOException;
import java.net.URI;
import java.util.Arrays;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.MediaType.APPLICATION_ATOM_XML;
import static org.springframework.http.MediaType.APPLICATION_OCTET_STREAM;
import static org.springframework.http.MediaType.APPLICATION_XML;
import static org.springframework.http.MediaType.TEXT_PLAIN;

@RunWith(MockitoJUnitRunner.class)
public class ContentTypeAdjusterInterceptorTests {

    private final ContentTypeAdjusterInterceptor interceptor =
            new ContentTypeAdjusterInterceptor(Arrays.asList(APPLICATION_XML, APPLICATION_ATOM_XML));

    private HttpHeaders httpHeaders;
    private MockClientHttpRequest httpRequest;

    @Mock
    private ClientHttpRequestExecution execution;

    @Mock
    private ClientHttpResponse mockResponse;

    @Before
    public void setUp() throws Exception {
        httpHeaders = new HttpHeaders();
        when(execution.execute(any(), any())).thenReturn(mockResponse);
        when(mockResponse.getHeaders()).thenReturn(httpHeaders);
    }

    @Test
    public void shouldAdjustContentTypeWhenFileExtensionMatchesSupportedTypes() throws IOException {
        givenRequest("/index.rss", TEXT_PLAIN);

        assertContentType(new MediaType("application", "rss+xml", UTF_8));
    }

    @Test
    public void shouldNotAdjustContentTypeWhenResponseContentTypeAlreadyDenotesRss() throws IOException {
        givenRequest("/index.rss", APPLICATION_ATOM_XML);

        assertContentType(APPLICATION_ATOM_XML);
    }

    @Test
    public void shouldNotAdjustContentTypeWhenResponseIsTextPlain() throws IOException {
        givenRequest("/index.txt", TEXT_PLAIN);

        assertContentType(TEXT_PLAIN);
    }

    @Test
    public void shouldAdjustContentTypeWithCharsetWhenFileExtensionMatchesSupportedTypes() throws IOException {
        givenRequest("/index.rss", new MediaType("text", "plain", UTF_8));

        assertContentType(new MediaType("application", "rss+xml", UTF_8));
    }

    @Test
    public void shouldNotAdjustContentTypeWithCharsetWhenResponseContentTypeAlreadyDenotesRss() throws IOException {
        MediaType expectedMediaType = new MediaType("application", "xml", UTF_8);

        givenRequest("/index.rss", expectedMediaType);

        assertContentType(expectedMediaType);
    }

    @Test
    public void shouldNotAdjustContentTypeWhenQueryStringContainsFileExtension() throws IOException {
        givenRequest("/index.txt?key=.rss", TEXT_PLAIN);

        assertContentType(TEXT_PLAIN);
    }

    @Test
    public void shouldSetRssContentTypeFromFileExtensionWhenContentTypeHeaderIsMissing() throws IOException {
        givenRequest("/index.rss", null);

        assertContentType(new MediaType("application", "rss+xml", UTF_8));
    }

    @Test
    public void shouldSetAtomContentTypeFromFileExtensionWhenContentTypeHeaderIsMissing() throws IOException {
        givenRequest("/index.atom", null);

        assertContentType(new MediaType("application", "atom+xml", UTF_8));
    }

    @Test
    public void shouldNotTextSetContentTypeFromFileExtensionWhenContentTypeHeaderIsMissing() throws IOException {
        givenRequest("/index.txt", null);

        assertContentType(APPLICATION_OCTET_STREAM);
    }

    @Test
    public void shouldNotSetContentTypeFromQueryStringWhenContentTypeHeaderIsMissing() throws IOException {
        givenRequest("/index.txt?key=.rss", null);

        assertContentType(APPLICATION_OCTET_STREAM);
    }

    private void givenRequest(String pathOrPathAndQueryString, MediaType mediaType) {
        httpRequest = new MockClientHttpRequest(GET, URI.create("http://localhost" + pathOrPathAndQueryString));
        if (mediaType != null) {
            httpHeaders.setContentType(mediaType);
        }
    }

    private void assertContentType(MediaType mediaType) throws IOException {
        try (var response = interceptor.intercept(httpRequest, "".getBytes(UTF_8), execution)) {
            assertThat(response.getHeaders().getContentType(), is(mediaType));
        }
    }
}
