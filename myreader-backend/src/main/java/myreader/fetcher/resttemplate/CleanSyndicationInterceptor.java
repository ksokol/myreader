package myreader.fetcher.resttemplate;

import org.apache.commons.io.IOUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

import static org.apache.commons.lang.StringUtils.EMPTY;

/**
 * @author Kamill Sokol
 */
class CleanSyndicationInterceptor implements ClientHttpRequestInterceptor {

    // http://stackoverflow.com/questions/5742543/an-invalid-xml-character-unicode-0xc-was-found
    private final Pattern pattern = Pattern.compile("[^\u0009\u0020-\uD7FF\uE000-\uFFFD\u10000-\u10FFF]+");

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
        final ClientHttpResponse execute = execution.execute(request, body);
        final Charset charset = getCharsetFromResponse(execute);
        final String cleanedBody;

        if (execute.getRawStatusCode() == 200) {
            final String bodyString = IOUtils.toString(execute.getBody(), charset);
            cleanedBody = pattern.matcher(bodyString).replaceAll(EMPTY);
        } else {
            cleanedBody = EMPTY;
        }

        return new ClientHttpResponse() {

            @Override
            public HttpHeaders getHeaders() {
                return execute.getHeaders();
            }

            @Override
            public InputStream getBody() throws IOException {
                return IOUtils.toInputStream(cleanedBody, StandardCharsets.UTF_8);
            }

            @Override
            public HttpStatus getStatusCode() throws IOException {
                return execute.getStatusCode();
            }

            @Override
            public int getRawStatusCode() throws IOException {
                return execute.getRawStatusCode();
            }

            @Override
            public String getStatusText() throws IOException {
                return execute.getStatusText();
            }

            @Override
            public void close() {
                execute.close();
            }
        };
    }

    private Charset getCharsetFromResponse(ClientHttpResponse execute) {
        MediaType contentType = execute.getHeaders().getContentType();
        return contentType == null ? StandardCharsets.UTF_8 : contentType.getCharSet();
    }
}
