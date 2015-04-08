package myreader.config.jawr;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author Kamill Sokol
 */
@Configuration
public class JavascriptConfigPropertiesSource {
    
    @Bean
    public Properties javascriptConfigPropertiesSource(@Value("${jawr.debug.on:false}") boolean debug) {
        return new ConfigBuilder(debug)
                .jsBundle("mobile")
                .webjar("angularjs/1.3.6/angular.js")
                .build();
    }
}
