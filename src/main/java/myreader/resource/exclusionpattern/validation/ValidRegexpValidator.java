package myreader.resource.exclusionpattern.validation;

import org.springframework.util.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

/**
 * @author Kamill Sokol
 */
public class ValidRegexpValidator implements ConstraintValidator<ValidRegexp, String> {
    @Override
    public void initialize(ValidRegexp constraintAnnotation) {
        //empty
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if(!StringUtils.hasText(value)) {
            return false;
        }
        try {
            Pattern.compile(value);
        } catch (PatternSyntaxException e) {
            return false;
        }
        return true;
    }
}
