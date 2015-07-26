package myreader.config;

import org.eclipse.jetty.server.session.HashSessionManager;
import org.eclipse.jetty.server.session.SessionHandler;
import org.eclipse.jetty.webapp.WebAppContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.embedded.jetty.JettyEmbeddedServletContainerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ApplicationEventMulticaster;
import org.springframework.context.event.SimpleApplicationEventMulticaster;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import javax.servlet.ServletContext;

/**
 * @author Kamill Sokol
 */
@Configuration
public class CommonConfig {

    @Bean(name = "customExecutor", destroyMethod="shutdown")
    public Executor taskScheduler() {
        return Executors.newScheduledThreadPool(10);
    }

    @Bean
    public ApplicationEventMulticaster applicationEventMulticaster() {
        final SimpleApplicationEventMulticaster simpleApplicationEventMulticaster = new SimpleApplicationEventMulticaster();
        simpleApplicationEventMulticaster.setTaskExecutor(taskScheduler());
        return simpleApplicationEventMulticaster;
    }

    @Bean
    public JettyEmbeddedServletContainerFactory jettyEmbeddedServletContainerFactory(@Value("${tmpdir:tmp}") final String tmpDir, @Value("${saveperiod:60}") final int savePeriod) {
        return new JettyEmbeddedServletContainerFactory() {
            @Override
            protected void postProcessWebAppContext(final WebAppContext webAppContext) {
                webAppContext.setAttribute(ServletContext.TEMPDIR, new File(tmpDir, "jawr")); //create tmp in current working directory

                final HashSessionManager hashSessionManager = new HashSessionManager();
                hashSessionManager.setSavePeriod(savePeriod);
                try {
                    hashSessionManager.setStoreDirectory(new File(tmpDir, "sessions"));
                } catch (IOException e) {
                    throw new RuntimeException(e.getMessage(), e);
                }
                webAppContext.setSessionHandler(new SessionHandler(hashSessionManager));
            }
        };
    }
}
