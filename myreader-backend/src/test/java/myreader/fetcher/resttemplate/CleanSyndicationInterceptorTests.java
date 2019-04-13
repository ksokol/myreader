package myreader.fetcher.resttemplate;

import org.apache.commons.io.ByteOrderMark;
import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpResponse;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * @author Kamill Sokol
 */
public class CleanSyndicationInterceptorTests {

    private CleanSyndicationInterceptor interceptor = new CleanSyndicationInterceptor();

    private HttpHeaders httpHeaders = new HttpHeaders();
    private HttpRequest httpRequest = mock(HttpRequest.class);
    private ClientHttpRequestExecution execution = mock(ClientHttpRequestExecution.class);
    private ClientHttpResponse mockResponse = mock(ClientHttpResponse.class);

    @Before
    public void setUp() throws Exception {
        when(execution.execute(any(), any())).thenReturn(mockResponse);
        when(mockResponse.getHeaders()).thenReturn(httpHeaders);
        when(mockResponse.getRawStatusCode()).thenReturn(200);
    }

    @Test
    public void testCharacterEncoding() throws Exception {
        withContentType("text/plain;charset=ISO-8859-1");
        withBody("ä", "ISO-8859-1");

        final ClientHttpResponse response = intercept();
        final String body = body(response, "ISO-8859-1");

        assertThat(body, is("ä"));
    }

    @Test
    public void testReplaceInvalidCharacter() throws Exception {
        withContentType("text/plain;charset=UTF-8");
        withBody("\fstring\f", "UTF-8");

        final ClientHttpResponse response = intercept();
        final String body = body(response, "UTF-8");

        assertThat(body, is("string"));
    }

    @Test
    public void testEmptyBody() throws Exception {
        withBody("string", "UTF-8");

        when(mockResponse.getRawStatusCode()).thenReturn(302);

        final ClientHttpResponse response = intercept();
        final String body = body(response, "UTF-8");

        assertThat(body, is(""));
    }

    @Test
    public void testRemoveByteOrderMark() throws Exception {
        withBody(ByteOrderMark.UTF_8.getBytes());

        final ClientHttpResponse response = intercept();
        byte[] actualBytes = IOUtils.toByteArray(response.getBody());

        assertThat(actualBytes.length, is(0));
    }

    private String body(ClientHttpResponse response, String charset) throws IOException {
        return IOUtils.toString(response.getBody(), charset);
    }

    private void withContentType(String contentType) {
        httpHeaders.setContentType(MediaType.parseMediaType(contentType));
    }

    private void withBody(byte[] byteBody) throws IOException {
        when(mockResponse.getBody()).thenReturn(new ByteArrayInputStream(byteBody));
    }

    private void withBody(String bodyString, String bodyCharset) throws IOException {
        when(mockResponse.getBody()).thenReturn(new ByteArrayInputStream(bodyString.getBytes(bodyCharset)));
    }

    private ClientHttpResponse intercept() throws IOException {
        return interceptor.intercept(httpRequest, new byte[] {}, execution);
    }

}