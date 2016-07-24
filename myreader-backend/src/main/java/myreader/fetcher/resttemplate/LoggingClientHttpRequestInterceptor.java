package myreader.fetcher.resttemplate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import java.io.IOException;

/**
 * @since 2016-07
 */
public class LoggingClientHttpRequestInterceptor implements ClientHttpRequestInterceptor {

    private static final Logger log = LoggerFactory.getLogger(LoggingClientHttpRequestInterceptor.class);

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
        log.info("start - url: '{}' on thread '{}'", request.getURI(), Thread.currentThread().getName());
        final ClientHttpResponse response = execution.execute(request, body);
        log.info("end   - url: '{}' on thread '{}'", request.getURI(), Thread.currentThread().getName());
        return response;
    }
}
