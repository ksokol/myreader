package myreader.resource.service.patch;

import org.hibernate.validator.internal.engine.resolver.DefaultTraversableResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.http.converter.HttpMessageConverter;

import javax.validation.TraversableResolver;

/**
 * @author Kamill Sokol
 */
public class PatchSupportConfig {

    @Bean
    public HttpMessageConverter patchSupportHttpMessageConverter() {
        return new PatchSupportMessageConverter();
    }

    @Bean
    public TraversableResolver patchSupportTraversableResolver() {
        DefaultTraversableResolver defaultTraversableResolver = new DefaultTraversableResolver();
        PatchSupportTraversableResolver patchSupportTraversableResolver = new PatchSupportTraversableResolver();
        patchSupportTraversableResolver.setDelegate(defaultTraversableResolver);
        return patchSupportTraversableResolver;
    }

    @Bean
    public PatchService patchService() {
        return new PatchServiceImpl();
    }
}
