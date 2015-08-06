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
import org.springframework.util.Assert;

import java.nio.charset.Charset;
import java.util.TimeZone;

/**
 * @author Kamill Sokol
 */
@ComponentScan({"myreader.service"})
@Import({CommonConfig.class, PersistenceConfig.class, SecurityConfig.class, ServiceConfig.class, TaskConfig.class, MvcConfig.class, ResourceConfig.class})
@EnableAutoConfiguration(exclude={FreeMarkerAutoConfiguration.class})
//@SpringBootApplication
public class Starter {

    public static void main(String[] args) throws Exception {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        Assert.isTrue("UTF-8".equals(System.getProperty("file.encoding")));
        Charset charset = Charset.defaultCharset();
        Assert.isTrue(charset.equals(Charset.forName("UTF-8")));
        SpringApplication.run(Starter.class, args);
    }

}
