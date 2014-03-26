package myreader.resource;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@EnableWebMvc
@ComponentScan(basePackages = {"myreader.resource"})
@Configuration
public class ResourceConfig extends WebMvcConfigurerAdapter {
}
