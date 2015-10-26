package myreader.resource.common.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import javax.validation.Constraint;

/**
 * @author Kamill Sokol
 */
@Target({ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy=ValidSyndicationValidator.class)
public @interface ValidSyndication {
    String message() default "invalid syndication feed";
    Class[] groups() default {};
    Class[] payload() default {};
}
