package myreader.fetcher.resttemplate;

import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.ssl.SSLContextBuilder;

import javax.net.ssl.SSLContext;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.TimeUnit;

/**
 * @author Kamill Sokol
 */
final class HttpClientBuilderUtil {
    private HttpClientBuilderUtil() {
        // util class
    }

    /**
     * Cookie management has to be enabled. For instance, Cloudflare rejects any subsequent calls within some milliseconds
     * when __cfduid cookie is missing.
     *
     * @see <a href="https://support.cloudflare.com/hc/en-us/articles/200170156-What-does-the-CloudFlare-cfduid-cookie-do-">
     *     What does the Cloudflare cfduid cookie do?</a>
     */
    static HttpClient customHttpClient() {
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

    private static SSLConnectionSocketFactory sslSocketFactory() {
        // provide SSLContext that allows self-signed certificate

        try {
            SSLContext sslContext = new SSLContextBuilder().loadTrustMaterial((chain, authType) -> true).build();
            return new SSLConnectionSocketFactory(sslContext, new NoopHostnameVerifier());
        } catch (NoSuchAlgorithmException|KeyStoreException|KeyManagementException exception) {
            throw new IllegalArgumentException("error while build ssl connection socket factory ", exception);
        }
    }
}
