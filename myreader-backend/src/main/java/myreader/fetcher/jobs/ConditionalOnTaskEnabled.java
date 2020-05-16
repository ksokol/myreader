package myreader.fetcher.jobs;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author Kamill Sokol
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.TYPE })
@ConditionalOnProperty(prefix = "task", name = "enabled", havingValue = "true")
@interface ConditionalOnTaskEnabled { }
