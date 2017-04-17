package myreader.fetcher.resttemplate;

import myreader.fetcher.FeedParser;
import myreader.fetcher.impl.DefaultFeedParser;
import myreader.fetcher.impl.HystrixFeedParser;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static myreader.fetcher.resttemplate.HttpClientBuilderUtil.customHttpClient;
import static org.springframework.http.MediaType.APPLICATION_ATOM_XML;
import static org.springframework.http.MediaType.APPLICATION_XML;
import static org.springframework.http.MediaType.TEXT_XML;

/**
 * @author Kamill Sokol
 */
@Configuration
@EnableHystrix
public class FeedParserConfiguration {

    static final List<MediaType> SUPPORTED_TYPES = Arrays.asList(
            TEXT_XML,
            APPLICATION_ATOM_XML,
            APPLICATION_XML,
            new MediaType("application", "rss+xml"),
            new MediaType("application", "rss+atom")
    );

    private final Environment environment;

    public FeedParserConfiguration(Environment environment) {
        this.environment = environment;
    }

    @Bean
    public RestTemplate syndicationRestTemplate() {
        final RestTemplate restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory(customHttpClient()));
        restTemplate.setMessageConverters(Collections.singletonList(new SyndicationHttpMessageConverter(SUPPORTED_TYPES)));
        restTemplate.setInterceptors(interceptors());
        return restTemplate;
    }

    @Bean
    public FeedParser parser(ApplicationEventPublisher eventPublisher) {
        DefaultFeedParser defaultFeedParser = new DefaultFeedParser(syndicationRestTemplate(), eventPublisher);
        Boolean hystrixEnabled = environment.getProperty("hystrix.enabled", Boolean.class, true);
        return hystrixEnabled ? new HystrixFeedParser(defaultFeedParser) : defaultFeedParser;
    }

    private List<ClientHttpRequestInterceptor> interceptors() {
        List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>();
        interceptors.add(new UserAgentClientHttpRequestInterceptor());
        interceptors.add(new CleanSyndicationInterceptor());
        interceptors.add(new ContentTypeAdjusterInterceptor(SUPPORTED_TYPES));
        return interceptors;
    }
}
