package myreader.resource.subscriptiontag.beans;

import org.apache.commons.lang3.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.util.regex.Pattern;

/**
 * @author Kamill Sokol
 */
public class SubscriptionTagPatchRequestValidator implements Validator {

    private static final Pattern COLOR_PATTERN = Pattern.compile("^#(?:[0-9a-fA-F]{3}){1,2}$");

    @Override
    public boolean supports(Class<?> clazz) {
        return SubscriptionTagPatchRequest.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        SubscriptionTagPatchRequest request = (SubscriptionTagPatchRequest) target;

        String name = request.getName();
        if (StringUtils.isBlank(name)) {
            errors.rejectValue("name", "NotBlank.color", "may not be empty");
        }

        String color = request.getColor();
        if (color == null || !COLOR_PATTERN.matcher(color).matches()) {
            errors.rejectValue("color", "Pattern.color", "not a RGB hex code");
        }
    }
}
