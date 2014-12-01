package myreader.resource.exclusionpattern.validation;

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
@Constraint(validatedBy=ValidRegexpValidator.class)
public @interface ValidRegexp {
    String message() default "invalid regular expression";
    Class[] groups() default {};
    Class[] payload() default {};
}
