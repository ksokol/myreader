package myreader.resource.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.util.ISO8601DateFormat;
import org.springframework.hateoas.EntityLinks;
import spring.data.AbstractResourceAssembler;
import spring.data.DelegatingResourceAssemblers;
import spring.data.ResourceAssemblers;
import myreader.resource.service.patch.PatchSupportConfig;
import myreader.resource.subscription.assembler.SubscriptionEntityLinks;
import myreader.resource.subscription.assembler.SubscriptionGetResponseAssembler;
import myreader.resource.subscriptionentry.assembler.SubscriptionEntryEntityLinks;
import myreader.resource.subscriptionentry.assembler.SearchableSubscriptionEntryGetResponseAssembler;
import myreader.resource.subscriptionentry.assembler.SubscriptionEntryGetResponseAssembler;
import myreader.resource.subscriptiontaggroup.assembler.SubscriptionTagGroupEntityLinks;
import myreader.resource.subscriptiontaggroup.assembler.SubscriptionTagGroupGetResponseAssembler;
import myreader.resource.user.assembler.UserGetResponseEntityLinks;
import myreader.resource.user.assembler.UserGetResponseAssembler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.hateoas.config.EnableEntityLinks;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.web.bind.support.AuthenticationPrincipalArgumentResolver;
import org.springframework.validation.Validator;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import javax.validation.TraversableResolver;
import java.util.ArrayList;
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

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer.defaultContentType(MediaType.APPLICATION_JSON);
    }

    private MappingJackson2HttpMessageConverter configuredMappingJacksonHttpMessageConverter() {
        MappingJackson2HttpMessageConverter mappingJacksonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
        ObjectMapper objectMapper = new ObjectMapper();

        objectMapper.configure(SerializationFeature.WRITE_DATE_KEYS_AS_TIMESTAMPS, false);
        objectMapper.setDateFormat(new ISO8601DateFormat());

        mappingJacksonHttpMessageConverter.setObjectMapper(objectMapper);

        return mappingJacksonHttpMessageConverter;
    }

    @Bean
    public SubscriptionEntryEntityLinks subscriptionEntryEntityLinks(PagedResourcesAssembler pagedResourcesAssembler) {
        return new SubscriptionEntryEntityLinks(pagedResourcesAssembler);
    }

    @Bean
    public SubscriptionEntityLinks subscriptionEntityLinks(PagedResourcesAssembler pagedResourcesAssembler) {
        return new SubscriptionEntityLinks(pagedResourcesAssembler);
    }

    @Bean
    public UserGetResponseEntityLinks userGetResponseEntityLinks(PagedResourcesAssembler pagedResourcesAssembler) {
        return new UserGetResponseEntityLinks(pagedResourcesAssembler);
    }

    @Bean
    public SubscriptionTagGroupEntityLinks subscriptionTagGroupEntityLinks(PagedResourcesAssembler pagedResourcesAssembler) {
        return new SubscriptionTagGroupEntityLinks(pagedResourcesAssembler);
    }

    @Bean
    public ResourceAssemblers resourceAssemblers(PagedResourcesAssembler pagedResourcesAssembler, EntityLinks entityLinks) {
        ArrayList<AbstractResourceAssembler> assembler = new ArrayList<>();

        assembler.add(new SubscriptionEntryGetResponseAssembler(entityLinks));
        assembler.add(new SubscriptionTagGroupGetResponseAssembler(entityLinks));
        assembler.add(new SubscriptionGetResponseAssembler(entityLinks));
        assembler.add(new UserGetResponseAssembler(entityLinks));
        assembler.add(new SearchableSubscriptionEntryGetResponseAssembler(entityLinks));

        ResourceAssemblers resourceAssemblers = new DelegatingResourceAssemblers(assembler, pagedResourcesAssembler);
        return resourceAssemblers;
    }
}
