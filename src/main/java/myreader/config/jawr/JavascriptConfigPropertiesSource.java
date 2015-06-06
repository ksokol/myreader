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
public class JavascriptConfigPropertiesSource {

    @Autowired
    private Environment environment;

    @Bean
    public Properties javascriptConfigPropertiesSource() {
        final boolean debug = environment.getProperty("jawr.debug.on", Boolean.class, false);
        return new ConfigBuilder(debug)
                .jsBundle("mobile")
                    .webjar("angularjs/1.3.15/angular.js")
                    .webjar("angularjs/1.3.15/angular-animate.js")
                    .webjar("angularjs/1.3.15/angular-aria.js")
                    .webjar("angularjs/1.3.15/angular-sanitize.js")
                    .webjar("angular-ui-router/0.2.14/angular-ui-router.js")
                    .webjar("ui-router-extras/0.0.13/modular/ct-ui-router-extras.core.js")
                    .webjar("ui-router-extras/0.0.13/modular/ct-ui-router-extras.transition.js")
                    .webjar("ui-router-extras/0.0.13/modular/ct-ui-router-extras.previous.js")
                    .webjar("angular-local-storage/0.1.5/angular-local-storage.js")
                    .jar("static/app/js/lib/angular-cache.js") //TODO submit newest version to webjars
                    .webjar("angular-material/0.9.7/angular-material.js")
                    .jar("static/app/js/common/config.js")
                    .jar("static/app/js/common/api.js")
                    .jar("static/app/js/common/services.js")
                    .jar("static/app/js/common/controllers.js")
                    .jar("static/app/js/common/directives.js")
                .and()
                    .jsBundle("login")
                    .jar("static/js/jquery-1.8.min.js")
                    .jar("static/js/login.js")
                .build();
    }
}
