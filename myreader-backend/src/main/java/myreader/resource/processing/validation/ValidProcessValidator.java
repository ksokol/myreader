package myreader.resource.processing.validation;

import static org.slf4j.LoggerFactory.getLogger;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

/**
 * @author Kamill Sokol
 */
public class ValidProcessValidator implements ConstraintValidator<ValidProcess, String> {

    private static final Logger LOG = getLogger(ValidProcessValidator.class);

    private final ApplicationContext applicationContext;

    @Autowired
    public ValidProcessValidator(final ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Override
    public void initialize(ValidProcess validProcess) {
        //not needed
    }

    @Override
    public boolean isValid(String processName, ConstraintValidatorContext context) {
        try {
            applicationContext.getBean(processName, Runnable.class);
            return true;
        } catch (Exception exception) {
            LOG.warn("bean for requested process {} not found", processName);
        }
        return false;
    }
}
