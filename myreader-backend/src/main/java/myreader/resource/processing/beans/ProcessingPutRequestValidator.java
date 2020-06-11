package myreader.resource.processing.beans;

import org.springframework.context.ApplicationContext;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.util.Objects;

/**
 * @author Kamill Sokol
 */
public class ProcessingPutRequestValidator implements Validator {

    private final ApplicationContext applicationContext;

    public ProcessingPutRequestValidator(ApplicationContext applicationContext) {
        this.applicationContext = Objects.requireNonNull(applicationContext, "applicationContext is null");
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return ProcessingPutRequest.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        ProcessingPutRequest request = (ProcessingPutRequest) target;

        try {
            applicationContext.getBean(request.getProcess(), Runnable.class);
        } catch (Exception exception) {
            errors.rejectValue("process", "ValidProcess.process", "process does not exists");
        }
    }
}
