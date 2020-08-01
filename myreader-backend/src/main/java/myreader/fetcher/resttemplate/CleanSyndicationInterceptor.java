package myreader.fetcher.resttemplate;

import org.apache.commons.io.IOUtils;
import org.apache.commons.io.input.BOMInputStream;
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
import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

class CleanSyndicationInterceptor implements ClientHttpRequestInterceptor {

    // http://www.rgagnon.com/javadetails/java-sanitize-xml-string.html
    private final Pattern invalidXmlCharacters = Pattern.compile("[^\\u0009\\u000A\\u000D\\u0020-\\uD7FF\\uE000-\\uFFFD\\x{10000}-\\x{10FFFF}]");

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
        try (var execute = execution.execute(request, body)) {
            var charset = getCharsetFromResponse(execute);
            String cleanedBody;

            if (execute.getRawStatusCode() == HttpStatus.OK.value()) {
                var bodyString = IOUtils.toString(new BOMInputStream(execute.getBody()), charset.name());
                cleanedBody = invalidXmlCharacters.matcher(bodyString).replaceAll("");
            } else {
                cleanedBody = "";
            }

            return new ClientHttpResponse() {

                @Override
                public HttpHeaders getHeaders() {
                    return execute.getHeaders();
                }

                @Override
                public InputStream getBody() {
                    return new ByteArrayInputStream(cleanedBody.getBytes(charset));
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

    private static Charset getCharsetFromResponse(ClientHttpResponse execute) {
        var contentType = execute.getHeaders().getContentType();
        if (contentType == null || contentType.getCharset() == null) {
            return StandardCharsets.UTF_8;
        }
        return contentType.getCharset();
    }
}
