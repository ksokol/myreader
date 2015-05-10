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
                    .webjar("angular-ui-router/0.2.13/angular-ui-router.js")
                    .jar("static/app/js/common/config.js")
                    .jar("static/app/js/common/api.js")
                    .jar("static/app/js/common/services.js")
                    .jar("static/app/js/common/controllers.js")
                    .jar("static/app/js/common/directives.js")
                    .build();
    }
}
