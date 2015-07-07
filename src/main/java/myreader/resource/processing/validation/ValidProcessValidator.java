package myreader.resource.processing.validation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

/**
 * @author Kamill Sokol
 */
public class ValidProcessValidator implements ConstraintValidator<ValidProcess, String> {

    private final ApplicationContext applicationContext;

    @Autowired
    public ValidProcessValidator(final ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Override
    public void initialize(ValidProcess validProcess) {
    }

    @Override
    public boolean isValid(String processName, ConstraintValidatorContext context) {
        try {
            applicationContext.getBean(processName, Runnable.class);
            return true;
        } catch (Exception exception) {
            //empty on purpose
        }
        return false;
    }
}
