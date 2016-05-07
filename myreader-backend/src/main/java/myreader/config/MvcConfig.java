package myreader.config;

import org.apache.commons.lang3.SystemUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.web.bind.support.AuthenticationPrincipalArgumentResolver;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import spring.data.web.SequenceableHandlerMethodArgumentResolver;
import spring.hateoas.PagedResourcesAssembler;

import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON;

/**
 * @author Kamill Sokol
 */
//@EnableWebMvcSecurity
@ComponentScan(basePackages = {"spring.hateoas"})
@Configuration
@EnableSpringDataWebSupport
@EnableTransactionManagement
@EnableAsync
public class MvcConfig extends WebMvcConfigurerAdapter {

    @Autowired
    private Environment environment;

    @Override
    public void configureContentNegotiation(final ContentNegotiationConfigurer configurer) {
        configurer
                .defaultContentType(APPLICATION_JSON)
                .ignoreAcceptHeader(true)
                .favorParameter(false)
                .favorPathExtension(false);
    }

    //TODO should be added automatically when @EnableWebMvcSecurity is enabled
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.clear();
        argumentResolvers.add(new AuthenticationPrincipalArgumentResolver());
        argumentResolvers.add(new PageableHandlerMethodArgumentResolver());
        argumentResolvers.add(new SequenceableHandlerMethodArgumentResolver());
    }

    @Bean
    public PagedResourcesAssembler pagedResourcesAssembler() {
        return new PagedResourcesAssembler();
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
                    .setCachePeriod(0);
        }
    }
}
