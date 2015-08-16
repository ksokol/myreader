package myreader.config;

import static myreader.config.UrlMappings.JAWR_BIN;
import static myreader.config.UrlMappings.JAWR_CSS;
import static myreader.config.UrlMappings.JAWR_JS;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.springframework.http.MediaType.APPLICATION_JSON;

import freemarker.JawrScriptTemplateDirectiveModel;
import freemarker.JawrStyleTemplateDirectiveModel;
import freemarker.template.TemplateException;
import net.jawr.web.servlet.JawrSpringController;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.web.bind.support.AuthenticationPrincipalArgumentResolver;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.handler.SimpleUrlHandlerMapping;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;
import org.springframework.web.servlet.view.freemarker.FreeMarkerViewResolver;
import spring.data.web.SequenceableHandlerMethodArgumentResolver;
import spring.hateoas.PagedResourcesAssembler;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.TreeMap;

/**
 * @author Kamill Sokol
 */
//@EnableWebMvcSecurity
@ComponentScan(basePackages = {"spring.hateoas"})
@Configuration
@EnableSpringDataWebSupport
@EnableTransactionManagement
@EnableAsync
public class MvcConfig extends WebMvcConfigurerAdapter {

    @Override
    public void configureContentNegotiation(final ContentNegotiationConfigurer configurer) {
        configurer
                .defaultContentType(APPLICATION_JSON)
                .ignoreAcceptHeader(true)
                .favorParameter(false)
                .favorPathExtension(false);
    }

    //TODO should be added automatically when @EnableWebMvcSecurity is enabled
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.clear();
        argumentResolvers.add(new AuthenticationPrincipalArgumentResolver());
        argumentResolvers.add(new PageableHandlerMethodArgumentResolver());
        argumentResolvers.add(new SequenceableHandlerMethodArgumentResolver());
    }

    @Bean
    public PagedResourcesAssembler pagedResourcesAssembler() {
        return new PagedResourcesAssembler();
    }

    @Override
    public void addViewControllers(final ViewControllerRegistry registry) {
        registry.addViewController(EMPTY).setViewName("index");
    }

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        FreeMarkerViewResolver freeMarkerViewResolver = new FreeMarkerViewResolver();
        freeMarkerViewResolver.setExposeSpringMacroHelpers(false);
        freeMarkerViewResolver.setSuffix(".ftl");
        registry.viewResolver(freeMarkerViewResolver);
    }
    @Bean
    public FreeMarkerConfigurer freeMarkerConfig() throws IOException, TemplateException {
        FreeMarkerConfigurer freeMarkerConfigurer = new FreeMarkerConfigurer();
        freeMarkerConfigurer.setTemplateLoaderPath("classpath:/templates/");
        Map<String, Object> m = new HashMap<>(5);

        m.put("style", new JawrStyleTemplateDirectiveModel());
        m.put("script", new JawrScriptTemplateDirectiveModel());

        freeMarkerConfigurer.setFreemarkerVariables(m);
        return freeMarkerConfigurer;
    }

    @Bean
    public SimpleUrlHandlerMapping urlMapping() {
        SimpleUrlHandlerMapping simpleUrlHandlerMapping = new SimpleUrlHandlerMapping();
        simpleUrlHandlerMapping.setOrder(Integer.MAX_VALUE - 2);

        final TreeMap<String, String> urlMap = new TreeMap<>();

        urlMap.put(JAWR_BIN.mapping() + "/**", "jawrBinaryController");
        urlMap.put(JAWR_CSS.mapping() + "/**", "jawrCssController");
        urlMap.put(JAWR_JS.mapping() + "/**", "jawrJavascriptController");

        simpleUrlHandlerMapping.setUrlMap(urlMap);
        return simpleUrlHandlerMapping;
    }

    @Bean
    public JawrSpringController jawrBinaryController() {
        JawrSpringController jawrSpringController = new JawrSpringController();
        jawrSpringController.setControllerMapping(JAWR_BIN.mapping());
        jawrSpringController.setConfiguration(new Properties());
        jawrSpringController.setType("binary");
        return jawrSpringController;
    }

    @Bean
    public JawrSpringController jawrCssController(@Qualifier("cssConfig") Properties properties) {
        JawrSpringController jawrSpringController = new JawrSpringController();
        jawrSpringController.setControllerMapping(JAWR_CSS.mapping());
        jawrSpringController.setConfiguration(properties);
        jawrSpringController.setType("css");
        return jawrSpringController;
    }

    @Bean
    public JawrSpringController jawrJavascriptController(@Qualifier("javascriptConfig") Properties properties) {
        JawrSpringController jawrSpringController = new JawrSpringController();
        jawrSpringController.setControllerMapping(JAWR_JS.mapping());
        jawrSpringController.setConfiguration(properties);
        jawrSpringController.setType("js");
        return jawrSpringController;
    }
}
