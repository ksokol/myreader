package myreader.resource.subscription.beans;

import org.apache.commons.lang3.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

/**
 * @author Kamill Sokol
 */
public class SubscriptionPatchRequestValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return SubscriptionPatchRequest.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        SubscriptionPatchRequest request = (SubscriptionPatchRequest) target;

        String title = request.getTitle();
        if (StringUtils.isBlank(title)) {
            errors.rejectValue("title", "NotBlank.title", "may not be empty");
        }

        SubscriptionPatchRequest.FeedTag feedTag = request.getFeedTag();
        if (feedTag != null) {
            String feedTagName = feedTag.getName();
            if (StringUtils.isBlank(feedTagName)) {
                errors.rejectValue("feedTag.name", "NotBlank.feedTag.name", "may not be empty");
            }
        }
    }
}
