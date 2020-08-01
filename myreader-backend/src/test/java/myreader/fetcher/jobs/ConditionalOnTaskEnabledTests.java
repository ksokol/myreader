package myreader.fetcher.jobs;

import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.stereotype.Component;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class ConditionalOnTaskEnabledTests {

    protected static final String BEAN_NAME = "testBean";

    @Test
    public void shouldNotContainBeanWhenTaskEnabledIsNotSet() {
        try (var applicationContext = new AnnotationConfigApplicationContext()) {
            applicationContext.register(TestBean.class);

            assertFalse(applicationContext.containsBean(BEAN_NAME));
        }
    }

    @Test
    public void shouldNotContainBeanWhenTaskEnabledIsSetToFalse() {
        var environment = new MockEnvironment();
        environment.setProperty("task.enabled", "false");

        try (var applicationContext = new AnnotationConfigApplicationContext()) {
            applicationContext.setEnvironment(environment);
            applicationContext.register(TestBean.class);

            assertFalse(applicationContext.containsBean(BEAN_NAME));
        }
    }

    @Test
    public void shouldContainBeanWhenTaskEnabledIsSetToTrue() {
        var environment = new MockEnvironment();
        environment.setProperty("task.enabled", "true");

        try (var applicationContext = new AnnotationConfigApplicationContext()) {
            applicationContext.setEnvironment(environment);
            applicationContext.register(TestBean.class);

            assertTrue(applicationContext.containsBean(BEAN_NAME));
        }
    }

    @Component(BEAN_NAME)
    @ConditionalOnTaskEnabled
    private static class TestBean {}
}

