package myreader.resource.subscription.beans;

import myreader.service.subscription.SubscriptionService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.util.Objects;

public class SubscriptionPatchRequestValidator implements Validator {

  private static final String FIELD_NAME = "origin";

  private final SubscriptionService subscriptionService;

  public SubscriptionPatchRequestValidator(SubscriptionService subscriptionService) {
    this.subscriptionService = Objects.requireNonNull(subscriptionService, "subscriptionService is null");
  }

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

    if (!subscriptionService.valid(request.getOrigin())) {
      errors.rejectValue(FIELD_NAME, "ValidSyndication.url", "invalid syndication feed");
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
