package myreader.resource;

import myreader.resource.service.patch.PatchSupportMessageConverter;
import myreader.resource.service.patch.PatchSupportTraversableResolver;
import org.hibernate.validator.internal.engine.resolver.DefaultTraversableResolver;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.hateoas.config.EnableEntityLinks;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJacksonHttpMessageConverter;
import org.springframework.security.web.bind.support.AuthenticationPrincipalArgumentResolver;
import org.springframework.validation.Validator;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.List;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@EnableWebMvc
@EnableEntityLinks
//@EnableWebMvcSecurity
@ComponentScan(basePackages = {"myreader.resource"})
@Configuration
@EnableSpringDataWebSupport
public class ResourceConfig extends WebMvcConfigurerAdapter {

    //TODO should be added automatically when @EnableWebMvcSecurity is enabled
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(new AuthenticationPrincipalArgumentResolver());
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(new PatchSupportMessageConverter());
        converters.add(new MappingJacksonHttpMessageConverter());
    }

    @Override
    public Validator getValidator() {
        LocalValidatorFactoryBean localValidatorFactoryBean = new LocalValidatorFactoryBean();
        DefaultTraversableResolver defaultTraversableResolver = new DefaultTraversableResolver();
        PatchSupportTraversableResolver patchSupportTraversableResolver = new PatchSupportTraversableResolver();
        patchSupportTraversableResolver.setDelegate(defaultTraversableResolver);
        localValidatorFactoryBean.setTraversableResolver(patchSupportTraversableResolver);
        return localValidatorFactoryBean;
    }
}
