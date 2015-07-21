package myreader.fetcher.resttemplate;

import myreader.fetcher.converter.AtomConverter;
import myreader.fetcher.converter.ChannelConverter;
import org.apache.http.client.HttpClient;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLContextBuilder;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.HttpClientBuilder;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.support.GenericConversionService;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.net.ssl.SSLContext;

/**
 * @author Kamill Sokol
 */
@Configuration
public class RestTemplateConfiguration implements InitializingBean {

    @Autowired
    private GenericConversionService conversionService;

    @Bean
    public RestTemplate syndicationRestTemplate() throws Exception {
        final RestTemplate restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory(buildHttpClient()));
        restTemplate.setMessageConverters(Collections.<HttpMessageConverter<?>> singletonList(new SyndicationHttpMessageConverter()));
        restTemplate.setInterceptors(interceptors());
        return restTemplate;
    }

    private HttpClient buildHttpClient() throws Exception {
        // provide SSLContext that allows self-signed certificate
        SSLContext sslContext = new SSLContextBuilder()
                .loadTrustMaterial(null, new TrustStrategy() {
                    @Override
                    public boolean isTrusted(final X509Certificate[] x509Certificates, final String s) throws CertificateException {
                        return true;
                    }
                }).build();

        SSLConnectionSocketFactory sslConnectionSocketFactory = new SSLConnectionSocketFactory(sslContext);

        // based on HttpClients.createSystem()
        return HttpClientBuilder.create()
                .useSystemProperties()
                .setMaxConnTotal(30000)
                .setSSLSocketFactory(sslConnectionSocketFactory) // add custom config
                .build();
    }

    private List<ClientHttpRequestInterceptor> interceptors() {
        List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>();
        interceptors.add(new UserAgentClientHttpRequestInterceptor());
        return interceptors;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        //TODO
        int maxSize = 10;
        conversionService.addConverter(new AtomConverter(maxSize));
        conversionService.addConverter(new ChannelConverter(maxSize));
    }
}
