package myreader.config.jawr;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

/**
 * @author Kamill Sokol
 */
@Configuration
public class CssConfigPropertiesSource {

    @Autowired
    private Environment environment;

    @Bean
    public Properties cssConfigProperties() {
        final boolean debug = environment.getProperty("jawr.debug.on", Boolean.class, false);
        return new ConfigBuilder(debug)
                .cssBundle("mobile")
                .webjar("angular-material/0.9.7/angular-material.css")
                .jar("static/app/css/mobile.css")
                .build();
    }
}
