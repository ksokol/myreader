package myreader.fetcher.resttemplate;

import myreader.fetcher.FeedParser;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static myreader.fetcher.resttemplate.HttpClientBuilderUtil.customHttpClient;

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
    public FeedParser parser() {
        return new FeedParser(syndicationRestTemplate());
    }

    private List<ClientHttpRequestInterceptor> interceptors() {
        List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>();
        interceptors.add(new UserAgentClientHttpRequestInterceptor());
        return interceptors;
    }
}
