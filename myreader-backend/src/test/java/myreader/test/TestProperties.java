package myreader.test;

import org.springframework.test.context.DynamicPropertyRegistry;

/**
 * @author Kamill Sokol
 */
public final class TestProperties {

    private TestProperties() {
        // prevent instantiation
    }

    public static void withProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", () -> "jdbc:hsqldb:mem:test");
        registry.add("spring.flyway.baseline-on-migrate", () -> false);
        registry.add("spring.jpa.properties.hibernate.search.default.directory_provider", () -> "ram");
    }
}
