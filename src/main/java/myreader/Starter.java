package myreader;

import myreader.config.JettyConfiguration;
import myreader.config.PersistenceConfig;
import myreader.config.SecurityConfig;
import myreader.config.TaskConfig;
import myreader.resource.config.ResourceConfig;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.freemarker.FreeMarkerAutoConfiguration;
import org.springframework.boot.context.embedded.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.context.support.XmlWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

/**
 * @author Kamill Sokol
 */
@ComponentScan({"myreader.service"})
@Import({JettyConfiguration.class, PersistenceConfig.class, SecurityConfig.class, TaskConfig.class})
@EnableAutoConfiguration(exclude={FreeMarkerAutoConfiguration.class})
//@SpringBootApplication
public class Starter {

    public static void main(String[] args) throws Exception {
        SpringApplication.run(Starter.class, args);
    }

    @Bean
    public ServletRegistrationBean apiV1() {
        DispatcherServlet dispatcherServlet = new DispatcherServlet();

        XmlWebApplicationContext applicationContext = new XmlWebApplicationContext();
        applicationContext.setConfigLocation("classpath:/META-INF/spring/webmvc-context.xml");
        dispatcherServlet.setApplicationContext(applicationContext);

        ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean(dispatcherServlet, "/api/*");
        servletRegistrationBean.setName("api-v1");

        return servletRegistrationBean;
    }

    @Bean
    public ServletRegistrationBean apiV2() {
        DispatcherServlet dispatcherServlet = new DispatcherServlet();

        AnnotationConfigWebApplicationContext applicationContext = new AnnotationConfigWebApplicationContext();
        applicationContext.register(ResourceConfig.class);
        dispatcherServlet.setApplicationContext(applicationContext);

        ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean(dispatcherServlet, "/api/2/*");
        servletRegistrationBean.setName("api-v2");
        return servletRegistrationBean;
    }

}
