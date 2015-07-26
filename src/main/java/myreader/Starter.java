package myreader;

import myreader.config.CommonConfig;
import myreader.config.MvcConfig;
import myreader.config.PersistenceConfig;
import myreader.config.ResourceConfig;
import myreader.config.SecurityConfig;
import myreader.config.ServiceConfig;
import myreader.config.TaskConfig;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.freemarker.FreeMarkerAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

/**
 * @author Kamill Sokol
 */
@ComponentScan({"myreader.service"})
@Import({CommonConfig.class, PersistenceConfig.class, SecurityConfig.class, ServiceConfig.class, TaskConfig.class, MvcConfig.class, ResourceConfig.class})
@EnableAutoConfiguration(exclude={FreeMarkerAutoConfiguration.class})
//@SpringBootApplication
public class Starter {

    public static void main(String[] args) throws Exception {
        SpringApplication.run(Starter.class, args);
    }

}
