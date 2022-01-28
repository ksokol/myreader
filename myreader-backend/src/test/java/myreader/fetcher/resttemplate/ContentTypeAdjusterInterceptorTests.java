package myreader.fetcher.resttemplate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.mock.http.client.MockClientHttpRequest;

import java.io.IOException;
import java.net.URI;
import java.util.Arrays;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.MediaType.APPLICATION_ATOM_XML;
import static org.springframework.http.MediaType.APPLICATION_OCTET_STREAM;
import static org.springframework.http.MediaType.APPLICATION_XML;
import static org.springframework.http.MediaType.TEXT_PLAIN;

@ExtendWith(MockitoExtension.class)
class ContentTypeAdjusterInterceptorTests {

  private final ContentTypeAdjusterInterceptor interceptor =
    new ContentTypeAdjusterInterceptor(Arrays.asList(APPLICATION_XML, APPLICATION_ATOM_XML));

  private HttpHeaders httpHeaders;
  private MockClientHttpRequest httpRequest;

  @Mock
  private ClientHttpRequestExecution execution;

  @Mock
  private ClientHttpResponse mockResponse;

  @BeforeEach
  void setUp() throws Exception {
    httpHeaders = new HttpHeaders();
    when(execution.execute(any(), any())).thenReturn(mockResponse);
    when(mockResponse.getHeaders()).thenReturn(httpHeaders);
  }

  @Test
  void shouldAdjustContentTypeWhenFileExtensionMatchesSupportedTypes() throws IOException {
    givenRequest("/index.rss", TEXT_PLAIN);

    assertContentType(new MediaType("application", "rss+xml", UTF_8));
  }

  @Test
  void shouldNotAdjustContentTypeWhenResponseContentTypeAlreadyDenotesRss() throws IOException {
    givenRequest("/index.rss", APPLICATION_ATOM_XML);

    assertContentType(APPLICATION_ATOM_XML);
  }

  @Test
  void shouldNotAdjustContentTypeWhenResponseIsTextPlain() throws IOException {
    givenRequest("/index.txt", TEXT_PLAIN);

    assertContentType(TEXT_PLAIN);
  }

  @Test
  void shouldAdjustContentTypeWithCharsetWhenFileExtensionMatchesSupportedTypes() throws IOException {
    givenRequest("/index.rss", new MediaType("text", "plain", UTF_8));

    assertContentType(new MediaType("application", "rss+xml", UTF_8));
  }

  @Test
  void shouldNotAdjustContentTypeWithCharsetWhenResponseContentTypeAlreadyDenotesRss() throws IOException {
    var expectedMediaType = new MediaType("application", "xml", UTF_8);

    givenRequest("/index.rss", expectedMediaType);

    assertContentType(expectedMediaType);
  }

  @Test
  void shouldNotAdjustContentTypeWhenQueryStringContainsFileExtension() throws IOException {
    givenRequest("/index.txt?key=.rss", TEXT_PLAIN);

    assertContentType(TEXT_PLAIN);
  }

  @Test
  void shouldSetRssContentTypeFromFileExtensionWhenContentTypeHeaderIsMissing() throws IOException {
    givenRequest("/index.rss", null);

    assertContentType(new MediaType("application", "rss+xml", UTF_8));
  }

  @Test
  void shouldSetAtomContentTypeFromFileExtensionWhenContentTypeHeaderIsMissing() throws IOException {
    givenRequest("/index.atom", null);

    assertContentType(new MediaType("application", "atom+xml", UTF_8));
  }

  @Test
  void shouldNotTextSetContentTypeFromFileExtensionWhenContentTypeHeaderIsMissing() throws IOException {
    givenRequest("/index.txt", null);

    assertContentType(APPLICATION_OCTET_STREAM);
  }

  @Test
  void shouldNotSetContentTypeFromQueryStringWhenContentTypeHeaderIsMissing() throws IOException {
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
      assertThat(response.getHeaders().getContentType())
        .isEqualTo(mediaType);
    }
  }
}
