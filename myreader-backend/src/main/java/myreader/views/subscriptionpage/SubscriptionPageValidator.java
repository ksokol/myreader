package myreader.views.subscriptionpage;

import myreader.service.subscription.SubscriptionService;
import myreader.views.ValidationErrors;
import org.apache.commons.lang3.StringUtils;

import java.util.Map;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

class SubscriptionPageValidator {

  private static final String FIELD_NAME = "origin";
  private static final Pattern COLOR_PATTERN = Pattern.compile("^#(?:[0-9a-fA-F]{3}){1,2}$");

  private SubscriptionPageValidator() {
    // prevent instantiation
  }

  static void validateExclusionPattern(String pattern) {
    var errors = new ValidationErrors();

    if (StringUtils.isBlank(pattern)) {
      errors.rejectValue("pattern", "invalid regular expression");
    } else {
      try {
        Pattern.compile(pattern);
      } catch (PatternSyntaxException exception) {
        errors.rejectValue("pattern", "invalid regular expression");
      }
    }

    errors.throwIfContainsError();
  }

  static void validateSubscriptionPatchRequest(Map<String, Object> body, SubscriptionService subscriptionService) {
    var errors = new ValidationErrors();

    var title = (String) body.get("title");
    if (StringUtils.isBlank(title)) {
      errors.rejectValue("title", "may not be empty");
    }

    if (!subscriptionService.valid((String) body.get(FIELD_NAME))) {
      errors.rejectValue(FIELD_NAME, "invalid syndication feed");
    }

    var color = (String) body.get("color");
    if (color != null && !COLOR_PATTERN.matcher(color).matches()) {
      errors.rejectValue("color", "not a RGB hex code");
    }

    errors.throwIfContainsError();
  }
}
