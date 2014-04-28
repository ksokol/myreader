package myreader.resource.subscription.validation;

import javax.validation.Constraint;
import java.lang.annotation.*;

/**
 * @author Kamill Sokol
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy=UniqueSubscriptionValidator.class)
public @interface UniqueSubscription {
    String message() default "subscription exists";
    Class[] groups() default {};
    Class[] payload() default {};
}
