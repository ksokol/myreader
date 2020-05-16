package myreader.test;

import org.springframework.test.context.TestPropertySource;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author Kamill Sokol
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:hsqldb:mem:test",
        "spring.flyway.baseline-on-migrate=false",
        "spring.jpa.properties.hibernate.search.default.directory_provider=ram",
        "task.enabled=false"
})
public @interface WithTestProperties {}
