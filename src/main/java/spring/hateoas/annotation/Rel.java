package spring.hateoas.annotation;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

/**
 * @author Kamill Sokol
 */
@Retention( value = RUNTIME )
@Target( { TYPE } )
@Documented
public @interface Rel {
    String value();
}
