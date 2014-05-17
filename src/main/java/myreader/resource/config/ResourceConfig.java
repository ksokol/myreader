package myreader.resource.config;

import myreader.resource.service.patch.PatchSupportConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;
import org.codehaus.jackson.map.util.ISO8601DateFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.hateoas.config.EnableEntityLinks;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJacksonHttpMessageConverter;
import org.springframework.security.web.bind.support.AuthenticationPrincipalArgumentResolver;
import org.springframework.validation.Validator;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import javax.validation.TraversableResolver;
import java.util.List;

/**
 * @author Kamill Sokol
 */
@EnableEntityLinks
//@EnableWebMvcSecurity
@ComponentScan(basePackages = {"myreader.resource"})
@Configuration
@Import({PatchSupportConfig.class, CustomDelegatingWebMvcConfiguration.class})
@EnableSpringDataWebSupport
public class ResourceConfig extends WebMvcConfigurerAdapter {

    @Autowired
    private HttpMessageConverter patchSupportHttpMessageConverter;

    @Autowired
    private TraversableResolver patchSupportTraversableResolver;

    //TODO should be added automatically when @EnableWebMvcSecurity is enabled
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(new AuthenticationPrincipalArgumentResolver());
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(patchSupportHttpMessageConverter);
        converters.add(configuredMappingJacksonHttpMessageConverter());
    }

    @Override
    public Validator getValidator() {
        LocalValidatorFactoryBean localValidatorFactoryBean = new LocalValidatorFactoryBean();
        localValidatorFactoryBean.setTraversableResolver(patchSupportTraversableResolver);
        return localValidatorFactoryBean;
    }

//    @Override
//    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
//        configurer.defaultContentType(MediaType.APPLICATION_JSON);
//    }

    private MappingJacksonHttpMessageConverter configuredMappingJacksonHttpMessageConverter() {
        MappingJacksonHttpMessageConverter mappingJacksonHttpMessageConverter = new MappingJacksonHttpMessageConverter();
        ObjectMapper objectMapper = new ObjectMapper();

        objectMapper.configure(SerializationConfig.Feature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectMapper.setDateFormat(new ISO8601DateFormat());

        mappingJacksonHttpMessageConverter.setObjectMapper(objectMapper);

        return mappingJacksonHttpMessageConverter;
    }
}
