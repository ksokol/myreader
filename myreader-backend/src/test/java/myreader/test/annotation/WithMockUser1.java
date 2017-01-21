package myreader.test.annotation;

import org.springframework.security.test.context.support.WithMockUser;

import java.lang.annotation.Documented;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * @author Kamill Sokol
 */
@Target({ METHOD, TYPE })
@Retention(RUNTIME)
@Inherited
@Documented
@WithMockUser(username="user1@localhost")
public @interface WithMockUser1 {}
