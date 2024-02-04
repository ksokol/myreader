package myreader.test;

import org.springframework.test.context.TestPropertySource;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@TestPropertySource(properties = {
  "spring.datasource.url=jdbc:hsqldb:mem:test",
  "spring.flyway.baseline-on-migrate=false",
  "task.enabled=false",
  "logging.level.org.springframework.web=OFF",
  "user.password.sha512=" + WithTestProperties.PASSWORD,
  "logging.level.root=OFF",
})
public @interface WithTestProperties {

  String PASSWORD = "bogus";
}
