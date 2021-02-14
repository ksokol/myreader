package myreader.resource.subscription.beans;

import myreader.service.subscription.SubscriptionService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.util.Objects;
import java.util.regex.Pattern;

public class SubscriptionPatchRequestValidator implements Validator {

  private static final String FIELD_NAME = "origin";
  private static final Pattern COLOR_PATTERN = Pattern.compile("^#(?:[0-9a-fA-F]{3}){1,2}$");

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

    String color = request.getColor();
    if (color != null && !COLOR_PATTERN.matcher(color).matches()) {
      errors.rejectValue("color", "Pattern.color", "not a RGB hex code");
    }
  }
}
