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
import java.util.Arrays;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.MediaType.APPLICATION_ATOM_XML;
import static org.springframework.http.MediaType.APPLICATION_XML;
import static org.springframework.http.MediaType.TEXT_PLAIN;

/**
 * @author Kamill Sokol
 */
public class ContentTypeAdjusterInterceptorTest {

    private static final MediaType RSS_MEDIA_TYPE = new MediaType("application", "rss+xml");

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

        assertContentType(RSS_MEDIA_TYPE);
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

    private void givenRequest(String pathOrPathAndQueryString, MediaType mediaType) {
        httpRequest = new MockClientHttpRequest(GET, URI.create("http://localhost" + pathOrPathAndQueryString));
        mockResponse.getHeaders().setContentType(mediaType);
    }

    private void assertContentType(MediaType mediaType) throws IOException {
        ClientHttpResponse response = interceptor.intercept(httpRequest, "".getBytes(UTF_8), execution);

        assertThat(response.getHeaders().getContentType(), is(mediaType));
    }

}
