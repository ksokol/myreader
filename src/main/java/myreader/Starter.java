package myreader;

import myreader.config.CommonConfig;
import myreader.config.MvcConfig;
import myreader.config.PersistenceConfig;
import myreader.config.SecurityConfig;
import myreader.config.ServiceConfig;
import myreader.config.TaskConfig;
import myreader.resource.config.ResourceConfig;
import org.eclipse.jetty.server.session.HashSessionManager;
import org.eclipse.jetty.server.session.SessionHandler;
import org.eclipse.jetty.webapp.WebAppContext;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.freemarker.FreeMarkerAutoConfiguration;
import org.springframework.boot.context.embedded.ServletRegistrationBean;
import org.springframework.boot.context.embedded.jetty.JettyEmbeddedServletContainerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.context.support.XmlWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import java.io.File;
import java.io.IOException;
import javax.servlet.ServletContext;

/**
 * @author Kamill Sokol
 */
@ComponentScan({"myreader.service"})
@Import({CommonConfig.class, PersistenceConfig.class, SecurityConfig.class, ServiceConfig.class, TaskConfig.class, MvcConfig.class})
@EnableAutoConfiguration(exclude={FreeMarkerAutoConfiguration.class})
//@SpringBootApplication
public class Starter {

    private static final String TMP_DIR = "tmp";
    private static final int SIXTY_SECONDS = 60;

    public static void main(String[] args) throws Exception {
        SpringApplication.run(Starter.class, args);
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

    @Bean
    public JettyEmbeddedServletContainerFactory jettyEmbeddedServletContainerFactory() {
        return new JettyEmbeddedServletContainerFactory() {
            @Override
            protected void postProcessWebAppContext(final WebAppContext webAppContext) {
                webAppContext.setAttribute(ServletContext.TEMPDIR, new File(TMP_DIR, "jawr")); //create tmp in current working directory

                final HashSessionManager hashSessionManager = new HashSessionManager();
                hashSessionManager.setSavePeriod(SIXTY_SECONDS);
                try {
                    hashSessionManager.setStoreDirectory(new File(TMP_DIR, "sessions"));
                } catch (IOException e) {
                    throw new RuntimeException(e.getMessage(), e);
                }
                webAppContext.setSessionHandler(new SessionHandler(hashSessionManager));
            }
        };
    }

}
