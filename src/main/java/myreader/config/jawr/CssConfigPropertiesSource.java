package myreader.config.jawr;

import static myreader.config.jawr.LibraryVersions.ANGULAR_MATERIAL;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.Properties;

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
                    .webjar("angular-material/" + ANGULAR_MATERIAL.version() + "/angular-material.css")
                    .jar("static/app/css/mobile.css")
                .and()
                .cssBundle("login")
                    .jar("/static/css/bootstrap-2.1.min.css")
                    .jar("/static/css/login.css")
                .build();
    }
}
