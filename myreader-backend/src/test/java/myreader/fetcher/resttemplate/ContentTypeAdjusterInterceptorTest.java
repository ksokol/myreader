package myreader.fetcher.resttemplate;

import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.mock.http.client.MockClientHttpRequest;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.Charset;
import java.util.Arrays;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.MediaType.APPLICATION_ATOM_XML;
import static org.springframework.http.MediaType.APPLICATION_OCTET_STREAM;
import static org.springframework.http.MediaType.APPLICATION_XML;
import static org.springframework.http.MediaType.TEXT_PLAIN;

/**
 * @author Kamill Sokol
 */
public class ContentTypeAdjusterInterceptorTest {

    private ClientHttpRequestExecution execution = mock(ClientHttpRequestExecution.class);
    private ClientHttpResponse mockResponse = mock(ClientHttpResponse.class);

    private HttpHeaders httpHeaders = new HttpHeaders();
    private MockClientHttpRequest httpRequest;

    private ContentTypeAdjusterInterceptor interceptor =
            new ContentTypeAdjusterInterceptor(Arrays.asList(APPLICATION_XML, APPLICATION_ATOM_XML));

    @Before
    public void setUp() throws Exception {
        when(execution.execute(any(), any())).thenReturn(mockResponse);
        when(mockResponse.getHeaders()).thenReturn(httpHeaders);
        when(mockResponse.getRawStatusCode()).thenReturn(200);
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

        assertContentType(new MediaType("application", "atom+xml", Charset.forName("UTF-8")));
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
            mockResponse.getHeaders().setContentType(mediaType);
        }
    }

    private void assertContentType(MediaType mediaType) throws IOException {
        ClientHttpResponse response = interceptor.intercept(httpRequest, "".getBytes(UTF_8), execution);

        assertThat(response.getHeaders().getContentType(), is(mediaType));
    }

}
