package myreader.fetcher.jobs;

import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.stereotype.Component;

import static org.assertj.core.api.Assertions.assertThat;

class ConditionalOnTaskEnabledTests {

  protected static final String BEAN_NAME = "testBean";

  @Test
  void shouldNotContainBeanWhenTaskEnabledIsNotSet() {
    try (var applicationContext = new AnnotationConfigApplicationContext()) {
      applicationContext.register(TestBean.class);

      assertThat(applicationContext.containsBean(BEAN_NAME))
        .isFalse();
    }
  }

  @Test
  void shouldNotContainBeanWhenTaskEnabledIsSetToFalse() {
    var environment = new MockEnvironment();
    environment.setProperty("task.enabled", "false");

    try (var applicationContext = new AnnotationConfigApplicationContext()) {
      applicationContext.setEnvironment(environment);
      applicationContext.register(TestBean.class);

      assertThat(applicationContext.containsBean(BEAN_NAME))
        .isFalse();
    }
  }

  @Test
  void shouldContainBeanWhenTaskEnabledIsSetToTrue() {
    var environment = new MockEnvironment();
    environment.setProperty("task.enabled", "true");

    try (var applicationContext = new AnnotationConfigApplicationContext()) {
      applicationContext.setEnvironment(environment);
      applicationContext.register(TestBean.class);

      assertThat(applicationContext.containsBean(BEAN_NAME))
        .isTrue();
    }
  }

  @Component(BEAN_NAME)
  @ConditionalOnTaskEnabled
  private static class TestBean {
  }
}

