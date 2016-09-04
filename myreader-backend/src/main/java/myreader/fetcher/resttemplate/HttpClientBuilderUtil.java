package myreader.fetcher.resttemplate;

import org.apache.http.client.HttpClient;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.ssl.SSLContextBuilder;

import javax.net.ssl.SSLContext;
import java.util.concurrent.TimeUnit;

/**
 * @author Kamill Sokol
 */
final class HttpClientBuilderUtil {
    private HttpClientBuilderUtil() {
        // util class
    }

    public static HttpClient customHttpClient() {
        return HttpClientBuilder.create()
                .useSystemProperties()
                .setMaxConnTotal(30000)
                .evictIdleConnections(60, TimeUnit.SECONDS)
                .disableAutomaticRetries()
                .setSSLSocketFactory(sslSocketFactory())
                .disableCookieManagement()
                .build();
    }

    private static SSLConnectionSocketFactory sslSocketFactory() {
        // provide SSLContext that allows self-signed certificate

        try {
            SSLContext sslContext = new SSLContextBuilder().loadTrustMaterial(null, (x509Certificates, s) -> true).build();
            return new SSLConnectionSocketFactory(sslContext, new NoopHostnameVerifier());
        } catch (Exception exception) {
            throw new RuntimeException(exception.getMessage(), exception);
        }
    }
}
