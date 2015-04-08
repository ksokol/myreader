package myreader;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.freemarker.FreeMarkerAutoConfiguration;
import org.springframework.boot.context.embedded.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.web.context.support.XmlWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import myreader.config.MvcConfig;
import myreader.config.PersistenceConfig;
import myreader.config.SecurityConfig;
import myreader.config.TaskConfig;

/**
 * @author Kamill Sokol
 */
@ComponentScan({"myreader.service"})
@Import({PersistenceConfig.class, SecurityConfig.class, TaskConfig.class, MvcConfig.class})
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
        applicationContext.setConfigLocation("classpath:/META-INF/spring/apimvc-context.xml");
        dispatcherServlet.setApplicationContext(applicationContext);

        ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean(dispatcherServlet, "/api/*");
        servletRegistrationBean.setName("api-v1");

        return servletRegistrationBean;
    }

    @Bean
    public ServletRegistrationBean web() {
        DispatcherServlet dispatcherServlet = new DispatcherServlet();

        XmlWebApplicationContext applicationContext = new XmlWebApplicationContext();
        applicationContext.setConfigLocation("classpath:/META-INF/spring/webmvc-context.xml");
        dispatcherServlet.setApplicationContext(applicationContext);

        ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean(dispatcherServlet, "/");
        servletRegistrationBean.setName("dispatcherServlet");

        return servletRegistrationBean;
    }

//    @Bean
//    public ServletRegistrationBean apiV2() {
//        DispatcherServlet dispatcherServlet = new DispatcherServlet();
//
//        AnnotationConfigWebApplicationContext applicationContext = new AnnotationConfigWebApplicationContext();
//        applicationContext.register(ResourceConfig.class);
//        dispatcherServlet.setApplicationContext(applicationContext);
//
//        ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean(dispatcherServlet, "/api/2/*");
//        servletRegistrationBean.setName("api-v2");
//        return servletRegistrationBean;
//    }

}
