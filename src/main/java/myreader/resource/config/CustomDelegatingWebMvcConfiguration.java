package myreader.resource.config;

import org.springframework.beans.PropertyEditorRegistrar;
import org.springframework.beans.PropertyEditorRegistry;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.support.ConfigurableWebBindingInitializer;
import org.springframework.web.servlet.config.annotation.DelegatingWebMvcConfiguration;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

/**
 * @author Kamill Sokol
 */
@Configuration
class CustomDelegatingWebMvcConfiguration extends DelegatingWebMvcConfiguration {

    @Override
    public RequestMappingHandlerMapping requestMappingHandlerMapping() {
        RequestMappingHandlerMapping requestMappingHandlerMapping = super.requestMappingHandlerMapping();
        requestMappingHandlerMapping.setUseSuffixPatternMatch(false);
        return requestMappingHandlerMapping;
    }

    @Override
    protected ConfigurableWebBindingInitializer getConfigurableWebBindingInitializer() {
        ConfigurableWebBindingInitializer configurableWebBindingInitializer = super.getConfigurableWebBindingInitializer();

        configurableWebBindingInitializer.setPropertyEditorRegistrar(new PropertyEditorRegistrar() {
            @Override
            public void registerCustomEditors(PropertyEditorRegistry registry) {
                registry.registerCustomEditor(String.class, new UTF8DecoderPropertyEditor("UTF-8"));
            }
        });

        return configurableWebBindingInitializer;
    }
}
