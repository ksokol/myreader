package myreader.resource.config;

import org.springframework.beans.PropertyEditorRegistrar;
import org.springframework.beans.PropertyEditorRegistry;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.support.ConfigurableWebBindingInitializer;
import org.springframework.web.servlet.config.annotation.DelegatingWebMvcConfiguration;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.beans.PropertyEditorSupport;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

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
                registry.registerCustomEditor(String.class, new PropertyEditorSupport() {
                    @Override
                    public void setAsText(String text) {
                        if (text == null) {
                            setValue(null);
                        } else {
                            String value = text.trim();

                            try {
                                String decoded = URLDecoder.decode(value, "UTF-8");
                                setValue(decoded);
                            } catch (UnsupportedEncodingException e) {
                                throw new IllegalArgumentException(e.getMessage(), e);
                            }
                        }
                    }
                });
            }
        });

        return configurableWebBindingInitializer;
    }
}
