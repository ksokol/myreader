package myreader.web.subscription;

import java.util.regex.Pattern;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import myreader.web.subscription.SubscriptionEditForm.Exclusion;

@Deprecated
class SubscriptionEditFormValidator implements Validator {

    private static final Pattern PATTERN_URL = Pattern.compile("^https?://.*");

    @Override
    public boolean supports(Class<?> clazz) {
        return SubscriptionEditForm.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        SubscriptionEditForm form = (SubscriptionEditForm) target;

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "url", "url.NotNull", "may not be null");

        if (form.getUrl() != null) {
            if (!PATTERN_URL.matcher(form.getUrl()).matches()) {
                errors.rejectValue("url", "url.pattern_not_allowed", "must start with http:// or https://");
            }
        }

        if (form.getId() != null) {
            ValidationUtils.rejectIfEmptyOrWhitespace(errors, "title", "title.NotNull", "may not be null");
        }

        if (form.getExclusions() != null) {
            for (int i = 0; i < form.getExclusions().size(); i++) {
                Exclusion e = form.getExclusions().get(i);

                try {
                    Pattern.compile(e.getPattern());
                } catch (Exception e1) {
                    errors.rejectValue("exclusion[]", "exclusion.Regexp", "not a valid java regular expression");
                }
            }
        }
    }
}
