package myreader.config;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.handler.SimpleUrlHandlerMapping;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;
import org.springframework.web.servlet.view.freemarker.FreeMarkerViewResolver;

import freemarker.JawrScriptTemplateDirectiveModel;
import freemarker.JawrStyleTemplateDirectiveModel;
import freemarker.LoginTemplateDirective;
import freemarker.template.TemplateException;
import myreader.config.jawr.CssConfigPropertiesSource;
import myreader.config.jawr.JavascriptConfigPropertiesSource;
import myreader.web.taglib.TagFunctions;
import net.jawr.web.servlet.JawrSpringController;

/**
 * @author Kamill Sokol
 */
@Configuration
@Import({CssConfigPropertiesSource.class, JavascriptConfigPropertiesSource.class})
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

        //deprecated
        registry.addViewController("mobile/reader").setViewName("reader/mobile/index");
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

        m.put("style", new JawrStyleTemplateDirectiveModel());
        m.put("script", new JawrScriptTemplateDirectiveModel());

        freeMarkerConfigurer.setFreemarkerVariables(m);
        return freeMarkerConfigurer;
    }

    @Bean
    public SimpleUrlHandlerMapping urlMapping() {
        SimpleUrlHandlerMapping simpleUrlHandlerMapping = new SimpleUrlHandlerMapping();
        simpleUrlHandlerMapping.setOrder(Integer.MAX_VALUE - 2);
        Properties properties = new Properties();

        properties.setProperty("/css-min/**", "jawrCssController");
        properties.setProperty("/js-min/**", "jawrJavascriptController");

        simpleUrlHandlerMapping.setMappings(properties);
        return simpleUrlHandlerMapping;
    }

    @Bean
    public JawrSpringController jawrCssController(@Qualifier("cssConfigProperties") Properties properties) {
        JawrSpringController jawrSpringController = new JawrSpringController();
        jawrSpringController.setControllerMapping("/css-min");
        jawrSpringController.setConfiguration(properties);
        jawrSpringController.setType("css");
        return jawrSpringController;
    }

    @Bean
    public JawrSpringController jawrJavascriptController(@Qualifier("javascriptConfigPropertiesSource") Properties properties) {
        JawrSpringController jawrSpringController = new JawrSpringController();
        jawrSpringController.setControllerMapping("/js-min");
        jawrSpringController.setConfiguration(properties);
        jawrSpringController.setType("js");
        return jawrSpringController;
    }
}
