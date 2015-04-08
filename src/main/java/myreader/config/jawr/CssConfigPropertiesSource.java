package myreader.config.jawr;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author Kamill Sokol
 */
@Configuration
public class CssConfigPropertiesSource {

    @Bean
    public Properties cssConfigProperties(@Value("${jawr.debug.on:false}") boolean debug) {
        return new ConfigBuilder(debug)
                .cssBundle("mobile")
                .jar("static/app/css/mobile.css")
                .build();
    }
}
