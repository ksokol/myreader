package myreader.fetcher.resttemplate;

import org.apache.http.client.HttpClient;
import org.apache.http.client.config.CookieSpecs;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.util.PublicSuffixMatcher;
import org.apache.http.conn.util.PublicSuffixMatcherLoader;
import org.apache.http.cookie.CookieSpecProvider;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.cookie.DefaultCookieSpecProvider;
import org.apache.http.impl.cookie.IgnoreSpecProvider;
import org.apache.http.impl.cookie.NetscapeDraftSpecProvider;
import org.apache.http.impl.cookie.RFC6265CookieSpecProvider;
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
                .setMaxConnTotal(1)
                .setKeepAliveStrategy(new CustomConnectionKeepAliveStrategy(30 * 1000L))
                .evictIdleConnections(60, TimeUnit.SECONDS)
                .disableAutomaticRetries()
                .setSSLSocketFactory(sslSocketFactory())
                .setDefaultCookieSpecRegistry(expiresDatePatterns("EEE, dd-MMM-yy HH:mm:ss z", "EEE, dd MMM yyyy HH:mm:ss z"))
                .build();
    }

    private static Registry<CookieSpecProvider> expiresDatePatterns(String... datePatterns) {
        final PublicSuffixMatcher aDefault = PublicSuffixMatcherLoader.getDefault();
        final CookieSpecProvider defaultProvider = new DefaultCookieSpecProvider(DefaultCookieSpecProvider.CompatibilityLevel.DEFAULT, aDefault, datePatterns,
                false);
        final CookieSpecProvider laxStandardProvider = new RFC6265CookieSpecProvider(RFC6265CookieSpecProvider.CompatibilityLevel.RELAXED, aDefault);
        final CookieSpecProvider strictStandardProvider = new RFC6265CookieSpecProvider(RFC6265CookieSpecProvider.CompatibilityLevel.STRICT, aDefault);

        return RegistryBuilder.<CookieSpecProvider> create().register(CookieSpecs.DEFAULT, defaultProvider).register("best-match", defaultProvider)
                .register("compatibility", defaultProvider).register(CookieSpecs.STANDARD, laxStandardProvider)
                .register(CookieSpecs.STANDARD_STRICT, strictStandardProvider).register(CookieSpecs.NETSCAPE, new NetscapeDraftSpecProvider())
                .register(CookieSpecs.IGNORE_COOKIES, new IgnoreSpecProvider()).build();
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
