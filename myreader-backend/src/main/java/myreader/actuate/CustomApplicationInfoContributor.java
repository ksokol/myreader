package myreader.actuate;

import org.springframework.boot.actuate.info.Info;
import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import static java.util.Collections.singletonMap;

/**
 * @author Kamill Sokol
 */
@Component
public class CustomApplicationInfoContributor implements InfoContributor {

    private final Environment environment;

    public CustomApplicationInfoContributor(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void contribute(Info.Builder builder) {
        int retainDays = environment.getProperty("job.fetchError.retainInDays", int.class);
        builder.withDetail("app", singletonMap("fetchErrorRetainDays", retainDays));
    }
}
