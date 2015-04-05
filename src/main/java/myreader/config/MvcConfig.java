package myreader.config;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;
import org.springframework.web.servlet.view.freemarker.FreeMarkerViewResolver;

import freemarker.LoginTemplateDirective;
import freemarker.template.TemplateException;
import myreader.web.taglib.TagFunctions;

/**
 * @author Kamill Sokol
 */
@Configuration
public class MvcConfig extends WebMvcConfigurerAdapter {

    @Override
    public void configureContentNegotiation(final ContentNegotiationConfigurer configurer) {
        configurer.favorPathExtension(false);
    }

    @Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
    }
    
    @Override
    public void addViewControllers(final ViewControllerRegistry registry) {
        registry.addViewController(SecurityConfig.LOGIN_URL).setViewName("login");
    }

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        FreeMarkerViewResolver freeMarkerViewResolver = new FreeMarkerViewResolver();
        freeMarkerViewResolver.setExposeSpringMacroHelpers(false);
        freeMarkerViewResolver.setRequestContextAttribute("requestContext");
        freeMarkerViewResolver.setExposeRequestAttributes(true);
        freeMarkerViewResolver.setSuffix(".ftl");
        freeMarkerViewResolver.setAttributesMap(Collections.singletonMap("LOGIN_PROCESSING_URL", SecurityConfig.LOGIN_PROCESSING_URL));
        registry.viewResolver(freeMarkerViewResolver);
    }
    @Bean
    public FreeMarkerConfigurer freeMarkerConfig() throws IOException, TemplateException {
        FreeMarkerConfigurer freeMarkerConfigurer = new FreeMarkerConfigurer();
        freeMarkerConfigurer.setTemplateLoaderPath("classpath:/templates/");
        Map<String, Object> m = new HashMap<>(5);
        m.put("login", new LoginTemplateDirective());
        m.put("myreader", new TagFunctions());
        freeMarkerConfigurer.setFreemarkerVariables(m);
        return freeMarkerConfigurer;
    }
}
