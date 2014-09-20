package spring.data.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * @author Kamill Sokol
 */
@Retention( value = RUNTIME )
@Target( { TYPE } )
@Documented
public @interface Rel {
    String value();
}
