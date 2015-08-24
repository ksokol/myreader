package myreader.fetcher.resttemplate;

import myreader.fetcher.FeedParser;
import myreader.fetcher.impl.FetchStatisticsMethodInterceptor;
import myreader.repository.FetchStatisticRepository;
import myreader.service.time.TimeService;
import org.apache.http.client.HttpClient;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.ssl.SSLContextBuilder;
import org.springframework.aop.framework.ProxyFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.net.ssl.SSLContext;

/**
 * @author Kamill Sokol
 */
@Configuration
public class FeedParserConfiguration {

    @Bean
    public RestTemplate syndicationRestTemplate() throws Exception {
        final RestTemplate restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory(buildHttpClient()));
        restTemplate.setMessageConverters(Collections.<HttpMessageConverter<?>>singletonList(new SyndicationHttpMessageConverter()));
        restTemplate.setInterceptors(interceptors());
        return restTemplate;
    }

    @Bean
    public FeedParser parser(final FetchStatisticRepository fetchStatisticRepository, final TimeService timeService) throws Exception {
        final FeedParser feedParser = new FeedParser(syndicationRestTemplate());
        final ProxyFactoryBean proxyFactoryBean = new ProxyFactoryBean();

        proxyFactoryBean.setTarget(feedParser);
        proxyFactoryBean.addAdvice(new FetchStatisticsMethodInterceptor(fetchStatisticRepository, timeService));

        return (FeedParser) proxyFactoryBean.getObject();
    }

    private HttpClient buildHttpClient() throws Exception {
        // provide SSLContext that allows self-signed certificate
        SSLContext sslContext = new SSLContextBuilder().loadTrustMaterial(null, (x509Certificates, s) -> true).build();

        return HttpClientBuilder.create()
                .useSystemProperties()
                .setMaxConnTotal(30000)
                .setSSLSocketFactory(new SSLConnectionSocketFactory(sslContext, new NoopHostnameVerifier()))
                .build();
    }

    private List<ClientHttpRequestInterceptor> interceptors() {
        List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>();
        interceptors.add(new UserAgentClientHttpRequestInterceptor());
        return interceptors;
    }
}
