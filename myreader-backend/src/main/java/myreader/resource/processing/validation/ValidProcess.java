package myreader.resource.processing.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import javax.validation.Constraint;

/**
 * @author Kamill Sokol
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy=ValidProcessValidator.class)
public @interface ValidProcess {
    String message() default "process does not exists";
    Class[] groups() default {};
    Class[] payload() default {};
}
