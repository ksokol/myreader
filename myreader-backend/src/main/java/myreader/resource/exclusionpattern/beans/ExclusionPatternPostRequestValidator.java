package myreader.resource.exclusionpattern.beans;

import org.apache.commons.lang3.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

/**
 * @author Kamill Sokol
 */
public class ExclusionPatternPostRequestValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return ExclusionPatternPostRequest.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        ExclusionPatternPostRequest request = (ExclusionPatternPostRequest) target;

        String pattern = request.getPattern();
        if (StringUtils.isBlank(pattern)) {
            errors.rejectValue("pattern", "ValidRegexp.pattern", "invalid regular expression");
            return;
        }
        try {
            Pattern.compile(pattern);
        } catch (PatternSyntaxException exception) {
            errors.rejectValue("pattern", "ValidRegexp.pattern", "invalid regular expression");
        }
    }
}
