package myreader.fetcher.resttemplate;

import org.apache.commons.io.IOUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.regex.Pattern;

import static org.apache.commons.lang.StringUtils.EMPTY;

/**
 * @author Kamill Sokol
 */
public class CleanSyndicationInterceptor implements ClientHttpRequestInterceptor {

    // http://stackoverflow.com/questions/5742543/an-invalid-xml-character-unicode-0xc-was-found
    private final Pattern pattern = Pattern.compile("[^\u0009\u0020-\uD7FF\uE000-\uFFFD\u10000-\u10FFF\\u000D\\u000A]+");

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
        final ClientHttpResponse execute = execution.execute(request, body);
        final String cleanedBody;

        if(execute.getRawStatusCode() == 200) {
            final String bodyString = IOUtils.toString(execute.getBody(), Charset.forName("UTF-8"));
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
                return new ByteArrayInputStream(cleanedBody.getBytes(Charset.forName("UTF-8")));
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
}
