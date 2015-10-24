package myreader.fetcher.resttemplate;

import static myreader.fetcher.resttemplate.HttpClientBuilderUtil.customHttpClient;

import myreader.fetcher.FeedParser;
import myreader.fetcher.impl.FetchStatisticsMethodInterceptor;
import myreader.repository.FetchStatisticRepository;
import myreader.service.time.TimeService;
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

/**
 * @author Kamill Sokol
 */
@Configuration
public class FeedParserConfiguration {

    @Bean
    public RestTemplate syndicationRestTemplate() {
        final RestTemplate restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory(customHttpClient()));
        restTemplate.setMessageConverters(Collections.<HttpMessageConverter<?>>singletonList(new SyndicationHttpMessageConverter()));
        restTemplate.setInterceptors(interceptors());
        return restTemplate;
    }

    @Bean
    public FeedParser parser(final FetchStatisticRepository fetchStatisticRepository, final TimeService timeService) {
        final FeedParser feedParser = new FeedParser(syndicationRestTemplate());
        final ProxyFactoryBean proxyFactoryBean = new ProxyFactoryBean();

        proxyFactoryBean.setTarget(feedParser);
        proxyFactoryBean.addAdvice(new FetchStatisticsMethodInterceptor(fetchStatisticRepository, timeService));

        return (FeedParser) proxyFactoryBean.getObject();
    }

    private List<ClientHttpRequestInterceptor> interceptors() {
        List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>();
        interceptors.add(new UserAgentClientHttpRequestInterceptor());
        return interceptors;
    }
}
