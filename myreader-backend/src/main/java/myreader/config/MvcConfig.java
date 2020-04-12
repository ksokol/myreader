package myreader.config;

import myreader.resource.subscriptionentry.SearchRequestHandlerMethodArgumentResolver;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.Clock;
import java.util.List;

import static myreader.config.UrlMappings.LANDING_PAGE;
import static org.springframework.http.MediaType.APPLICATION_JSON;

/**
 * @author Kamill Sokol
 */
@Configuration
@EnableTransactionManagement
@EnableAsync
public class MvcConfig implements WebMvcConfigurer {

    private final Clock clock;

    public MvcConfig(Clock clock) {
        this.clock = clock;
    }

    @Override
    public void configureContentNegotiation(final ContentNegotiationConfigurer configurer) {
        configurer
                .defaultContentType(APPLICATION_JSON)
                .favorParameter(false);
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(new SearchRequestHandlerMethodArgumentResolver(clock));
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
        registry.addViewController(LANDING_PAGE.mapping()).setViewName("index.html");
    }
}
