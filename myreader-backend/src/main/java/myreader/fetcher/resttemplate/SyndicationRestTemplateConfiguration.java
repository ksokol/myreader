package myreader.fetcher.resttemplate;

import org.apache.hc.client5.http.classic.HttpClient;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.apache.hc.client5.http.ssl.NoopHostnameVerifier;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactory;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactoryBuilder;
import org.apache.hc.core5.http.io.SocketConfig;
import org.apache.hc.core5.pool.PoolReusePolicy;
import org.apache.hc.core5.ssl.SSLContexts;
import org.apache.hc.core5.util.TimeValue;
import org.apache.hc.core5.util.Timeout;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_ATOM_XML;
import static org.springframework.http.MediaType.APPLICATION_XML;
import static org.springframework.http.MediaType.TEXT_HTML;
import static org.springframework.http.MediaType.TEXT_XML;

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
    var restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory(customHttpClient()));
    restTemplate.setMessageConverters(Collections.singletonList(new SyndicationHttpMessageConverter(SUPPORTED_TYPES)));
    restTemplate.setInterceptors(interceptors());
    return restTemplate;
  }

  /**
   * Cookie management has to be enabled. For instance, Cloudflare rejects any subsequent calls within some milliseconds
   * when __cfduid cookie is missing.
   *
   * @see <a href="https://support.cloudflare.com/hc/en-us/articles/200170156-What-does-the-CloudFlare-cfduid-cookie-do-">What does the Cloudflarse cfduid cookie do?</a>
   */
  private static HttpClient customHttpClient() throws NoSuchAlgorithmException, KeyStoreException, KeyManagementException {
    var timeout = 30;

    var connectionManager = PoolingHttpClientConnectionManagerBuilder.create()
      .setSSLSocketFactory(sslSocketFactory())
      .setDefaultSocketConfig(SocketConfig.custom()
        .setSoTimeout(Timeout.ofSeconds(timeout))
        .setSoKeepAlive(false)
        .build()
      )
      .setConnectionTimeToLive(TimeValue.ofSeconds(timeout))
      .setConnPoolPolicy(PoolReusePolicy.LIFO)
      .build();

    var requestConfig = RequestConfig.custom()
      .setConnectTimeout(Timeout.ofSeconds(timeout))
      .setConnectionRequestTimeout(Timeout.ofSeconds(timeout))
      .setResponseTimeout(Timeout.ofSeconds(timeout)).build();

    return HttpClients.custom()
      .setConnectionManager(connectionManager)
      .useSystemProperties()
      .setDefaultRequestConfig(requestConfig)
      .disableAutomaticRetries()
      .build();
  }

  /**
   * provide SSLContext that allows self-signed certificate
   */
  private static SSLConnectionSocketFactory sslSocketFactory() throws KeyStoreException, NoSuchAlgorithmException, KeyManagementException {
    return SSLConnectionSocketFactoryBuilder.create()
      .setSslContext(SSLContexts.custom()
        .loadTrustMaterial((chain, authType) -> true)
        .build()
      )
      .setHostnameVerifier(NoopHostnameVerifier.INSTANCE)
      .build();
  }

  private static List<ClientHttpRequestInterceptor> interceptors() {
    List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>();
    interceptors.add(new UserAgentClientHttpRequestInterceptor());
    interceptors.add(new CleanSyndicationInterceptor());
    interceptors.add(new ContentTypeAdjusterInterceptor(SUPPORTED_TYPES));
    return interceptors;
  }
}
