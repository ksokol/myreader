package myreader.fetcher.resttemplate;

import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.ssl.SSLContextBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.SSLContext;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.springframework.http.MediaType.APPLICATION_ATOM_XML;
import static org.springframework.http.MediaType.APPLICATION_XML;
import static org.springframework.http.MediaType.TEXT_HTML;
import static org.springframework.http.MediaType.TEXT_XML;

/**
 * @author Kamill Sokol
 */
@Configuration
public class SyndicationRestTemplateConfiguration {

    private static final List<MediaType> SUPPORTED_TYPES = Arrays.asList(
            TEXT_XML,
            TEXT_HTML,
            APPLICATION_ATOM_XML,
            APPLICATION_XML,
            new MediaType("application", "rss+xml"),
            new MediaType("application", "rss+atom")
    );

    @Bean
    public RestTemplate syndicationRestTemplate() throws NoSuchAlgorithmException, KeyStoreException, KeyManagementException {
        final RestTemplate restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory(customHttpClient()));
        restTemplate.setMessageConverters(Collections.singletonList(new SyndicationHttpMessageConverter(SUPPORTED_TYPES)));
        restTemplate.setInterceptors(interceptors());
        return restTemplate;
    }

    /**
     * Cookie management has to be enabled. For instance, Cloudflare rejects any subsequent calls within some milliseconds
     * when __cfduid cookie is missing.
     *
     * @see <a href="https://support.cloudflare.com/hc/en-us/articles/200170156-What-does-the-CloudFlare-cfduid-cookie-do-">
     *     What does the Cloudflare cfduid cookie do?</a>
     */
    private static HttpClient customHttpClient() throws NoSuchAlgorithmException, KeyStoreException, KeyManagementException {
        int timeout = 30;
        RequestConfig requestConfig = RequestConfig.custom()
                .setConnectTimeout(timeout * 1000)
                .setConnectionRequestTimeout(timeout * 1000)
                .setSocketTimeout(timeout * 1000).build();

        return HttpClientBuilder.create()
                .useSystemProperties()
                .setDefaultRequestConfig(requestConfig)
                .setMaxConnTotal(timeout * 1000)
                .evictIdleConnections(60, TimeUnit.SECONDS)
                .disableAutomaticRetries()
                .setSSLSocketFactory(sslSocketFactory())
                .build();
    }

    private static SSLConnectionSocketFactory sslSocketFactory() throws KeyStoreException, NoSuchAlgorithmException, KeyManagementException {
        // provide SSLContext that allows self-signed certificate
        SSLContext sslContext = new SSLContextBuilder().loadTrustMaterial((chain, authType) -> true).build();
        return new SSLConnectionSocketFactory(sslContext, new NoopHostnameVerifier());
    }

    private static List<ClientHttpRequestInterceptor> interceptors() {
        List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>();
        interceptors.add(new UserAgentClientHttpRequestInterceptor());
        interceptors.add(new CleanSyndicationInterceptor());
        interceptors.add(new ContentTypeAdjusterInterceptor(SUPPORTED_TYPES));
        return interceptors;
    }
}
