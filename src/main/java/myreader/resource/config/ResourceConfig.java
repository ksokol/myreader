package myreader.resource.config;

import java.util.ArrayList;
import java.util.List;

import javax.validation.TraversableResolver;

import myreader.resource.exclusionpattern.assembler.ExclusionPatternEntityLinks;
import myreader.resource.exclusionset.ExclusionSetCollectionResource;
import myreader.resource.exclusionset.beans.ExclusionSetGetResponse;
import myreader.resource.service.patch.PatchSupportConfig;
import myreader.resource.subscription.SubscriptionCollectionResource;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscriptionentry.SubscriptionEntryCollectionResource;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptiontaggroup.SubscriptionTagGroupCollectionResource;
import myreader.resource.subscriptiontaggroup.beans.SubscriptionTagGroupGetResponse;
import myreader.resource.user.UserEntityResource;
import myreader.resource.user.beans.UserGetResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.hateoas.EntityLinks;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.web.bind.support.AuthenticationPrincipalArgumentResolver;
import org.springframework.validation.Validator;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import spring.hateoas.DelegatingEntityLinks;
import spring.hateoas.EntityLinker;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.util.ISO8601DateFormat;

/**
 * @author Kamill Sokol
 */
//@EnableWebMvcSecurity
@ComponentScan(basePackages = {"myreader.resource", "spring.hateoas"})
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

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer.defaultContentType(MediaType.APPLICATION_JSON);
    }

    @Bean
    public EntityLinks EntityLinks() {
        List<EntityLinks> el = new ArrayList<>();

        el.add(new EntityLinker(SubscriptionTagGroupGetResponse.class, SubscriptionTagGroupCollectionResource.class));
        el.add(new EntityLinker(SubscriptionEntryGetResponse.class, SubscriptionEntryCollectionResource.class));
        el.add(new EntityLinker(SubscriptionGetResponse.class, SubscriptionCollectionResource.class));
        el.add(new EntityLinker(UserGetResponse.class, UserEntityResource.class));
        el.add(new EntityLinker(ExclusionSetGetResponse.class, ExclusionSetCollectionResource.class));
        el.add(new ExclusionPatternEntityLinks());

        return new DelegatingEntityLinks(el);
    }

    private MappingJackson2HttpMessageConverter configuredMappingJacksonHttpMessageConverter() {
        MappingJackson2HttpMessageConverter mappingJacksonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
        ObjectMapper objectMapper = new ObjectMapper();

        objectMapper.configure(SerializationFeature.WRITE_DATE_KEYS_AS_TIMESTAMPS, false);
        objectMapper.setDateFormat(new ISO8601DateFormat());

        mappingJacksonHttpMessageConverter.setObjectMapper(objectMapper);

        return mappingJacksonHttpMessageConverter;
    }
}
