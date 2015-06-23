package myreader.resource.config;

import static org.springframework.http.MediaType.APPLICATION_JSON;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.util.ISO8601DateFormat;
import myreader.resource.exclusionset.ExclusionSetCollectionResource;
import myreader.resource.exclusionset.beans.ExclusionSetGetResponse;
import myreader.resource.subscription.SubscriptionCollectionResource;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscriptionentry.SubscriptionEntryCollectionResource;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.converter.SubscriptionEntryGetResponseConverter;
import myreader.resource.user.UserEntityResource;
import myreader.resource.user.beans.UserGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ConversionServiceFactoryBean;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.web.bind.support.AuthenticationPrincipalArgumentResolver;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.validation.Validator;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import spring.data.web.SequenceableHandlerMethodArgumentResolver;
import spring.hateoas.DelegatingEntityLinks;
import spring.hateoas.EntityLinker;
import spring.hateoas.EntityLinks;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.validation.TraversableResolver;

/**
 * @author Kamill Sokol
 */
@EnableWebMvc
//@EnableWebMvcSecurity
@ComponentScan(basePackages = {"myreader.resource", "spring.hateoas"})
@Configuration
@EnableSpringDataWebSupport
@EnableTransactionManagement
public class ResourceConfig extends WebMvcConfigurerAdapter {

    @Autowired
    @Qualifier("patchSupportTraversableResolver")
    private TraversableResolver traversableResolver;

    //TODO should be added automatically when @EnableWebMvcSecurity is enabled
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(new AuthenticationPrincipalArgumentResolver());
        argumentResolvers.add(new SequenceableHandlerMethodArgumentResolver());
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(configuredMappingJacksonHttpMessageConverter());
    }

    @Override
    public Validator getValidator() {
        LocalValidatorFactoryBean localValidatorFactoryBean = new LocalValidatorFactoryBean();
        localValidatorFactoryBean.setTraversableResolver(traversableResolver);
        return localValidatorFactoryBean;
    }

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer
                .defaultContentType(APPLICATION_JSON)
                .ignoreAcceptHeader(true)
                .favorParameter(false)
                .favorPathExtension(false);
    }

    @Bean
    public EntityLinks entityLinks() {
        List<EntityLinker> el = new ArrayList<>();

        el.add(new EntityLinker(SubscriptionEntryGetResponse.class, SubscriptionEntryCollectionResource.class));
        el.add(new EntityLinker(SubscriptionGetResponse.class, SubscriptionCollectionResource.class));
        el.add(new EntityLinker(UserGetResponse.class, UserEntityResource.class));
        el.add(new EntityLinker(ExclusionSetGetResponse.class, ExclusionSetCollectionResource.class));

        return new DelegatingEntityLinks(el);
    }

    @Bean
    public ConversionServiceFactoryBean conversionService() {
        ConversionServiceFactoryBean conversionServiceFactoryBean = new ConversionServiceFactoryBean();
        Set<Converter> converters = new HashSet<>();
        converters.add(new SubscriptionEntryGetResponseConverter());
        conversionServiceFactoryBean.setConverters(converters);
        return conversionServiceFactoryBean;
    }

    private MappingJackson2HttpMessageConverter configuredMappingJacksonHttpMessageConverter() {
        MappingJackson2HttpMessageConverter mappingJacksonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
        ObjectMapper objectMapper = new ObjectMapper();

        objectMapper.configure(SerializationFeature.WRITE_DATE_KEYS_AS_TIMESTAMPS, false);
        objectMapper.setDateFormat(new ISO8601DateFormat());
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        mappingJacksonHttpMessageConverter.setObjectMapper(objectMapper);

        return mappingJacksonHttpMessageConverter;
    }
}
