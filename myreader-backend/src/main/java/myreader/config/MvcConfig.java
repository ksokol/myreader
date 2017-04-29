package myreader.config;

import org.apache.commons.lang3.SystemUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.List;

import static myreader.config.UrlMappings.LANDING_PAGE;
import static org.springframework.http.MediaType.APPLICATION_JSON;

/**
 * @author Kamill Sokol
 */
@Configuration
@EnableTransactionManagement
@EnableAsync
public class MvcConfig extends WebMvcConfigurerAdapter {

    @Autowired
    private Environment environment;

    @Override
    public void configureContentNegotiation(final ContentNegotiationConfigurer configurer) {
        configurer
                .defaultContentType(APPLICATION_JSON)
                .favorParameter(false);
    }

    //TODO should be added automatically when @EnableWebMvcSecurity is enabled
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.clear();
        argumentResolvers.add(new AuthenticationPrincipalArgumentResolver());
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
        registry.addViewController(LANDING_PAGE.mapping()).setViewName("index.html");
    }

    //TODO
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        if (environment.acceptsProfiles("dev")) {
            final String userDir = environment.getProperty("user.dir");
            String filePrefix = "file://";

            if(SystemUtils.IS_OS_WINDOWS){
                filePrefix += "/";
            }

            registry.addResourceHandler("/**")
                    .addResourceLocations(filePrefix + userDir + "/../myreader-frontend/")
                    .addResourceLocations(filePrefix + userDir + "/../myreader-frontend/src/")
                    .addResourceLocations("classpath:/static/")
                    .setCachePeriod(0);
        }
    }
}
