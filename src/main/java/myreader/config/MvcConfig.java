package myreader.config;

import static myreader.config.UrlMappings.JAWR_BIN;
import static myreader.config.UrlMappings.JAWR_CSS;
import static myreader.config.UrlMappings.JAWR_JS;
import static myreader.config.UrlMappings.LOGIN;
import static myreader.config.UrlMappings.LOGIN_PROCESSING;

import freemarker.JawrScriptTemplateDirectiveModel;
import freemarker.JawrStyleTemplateDirectiveModel;
import freemarker.LoginTemplateDirective;
import freemarker.template.TemplateException;
import myreader.config.jawr.CssConfigPropertiesSource;
import myreader.config.jawr.JavascriptConfigPropertiesSource;
import net.jawr.web.servlet.JawrSpringController;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.handler.SimpleUrlHandlerMapping;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;
import org.springframework.web.servlet.view.freemarker.FreeMarkerViewResolver;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * @author Kamill Sokol
 */
@EnableWebMvc
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
        registry.addViewController(LOGIN).setViewName("login");

        //deprecated
        registry.addViewController("reader").setViewName("index");
    }

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        FreeMarkerViewResolver freeMarkerViewResolver = new FreeMarkerViewResolver();
        freeMarkerViewResolver.setExposeSpringMacroHelpers(false);
        freeMarkerViewResolver.setRequestContextAttribute("requestContext");
        freeMarkerViewResolver.setExposeRequestAttributes(true);
        freeMarkerViewResolver.setSuffix(".ftl");
        freeMarkerViewResolver.setAttributesMap(Collections.singletonMap("LOGIN_PROCESSING_URL", LOGIN_PROCESSING));
        registry.viewResolver(freeMarkerViewResolver);
    }
    @Bean
    public FreeMarkerConfigurer freeMarkerConfig() throws IOException, TemplateException {
        FreeMarkerConfigurer freeMarkerConfigurer = new FreeMarkerConfigurer();
        freeMarkerConfigurer.setTemplateLoaderPath("classpath:/templates/");
        Map<String, Object> m = new HashMap<>(5);
        m.put("login", new LoginTemplateDirective());

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

        properties.setProperty(JAWR_BIN + "/**", "jawrBinaryController");
        properties.setProperty(JAWR_CSS + "/**", "jawrCssController");
        properties.setProperty(JAWR_JS + "/**", "jawrJavascriptController");

        simpleUrlHandlerMapping.setMappings(properties);
        return simpleUrlHandlerMapping;
    }

    @Bean
    public JawrSpringController jawrBinaryController() {
        JawrSpringController jawrSpringController = new JawrSpringController();
        jawrSpringController.setControllerMapping(JAWR_BIN);
        jawrSpringController.setConfiguration(new Properties());
        jawrSpringController.setType("binary");
        return jawrSpringController;
    }

    @Bean
    public JawrSpringController jawrCssController(@Qualifier("cssConfigProperties") Properties properties) {
        JawrSpringController jawrSpringController = new JawrSpringController();
        jawrSpringController.setControllerMapping(JAWR_CSS);
        jawrSpringController.setConfiguration(properties);
        jawrSpringController.setType("css");
        return jawrSpringController;
    }

    @Bean
    public JawrSpringController jawrJavascriptController(@Qualifier("javascriptConfigPropertiesSource") Properties properties) {
        JawrSpringController jawrSpringController = new JawrSpringController();
        jawrSpringController.setControllerMapping(JAWR_JS);
        jawrSpringController.setConfiguration(properties);
        jawrSpringController.setType("js");
        return jawrSpringController;
    }


}
