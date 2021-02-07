package myreader.resource.subscription.beans;

import myreader.service.feed.FeedService;
import org.springframework.validation.Errors;

import java.util.Objects;
import java.util.regex.Pattern;

class UrlValidator {

  private static final Pattern ORIGIN_PATTERN = Pattern.compile("^https?://.*");
  private static final String FIELD_NAME = "origin";

  private final FeedService feedService;

  UrlValidator(FeedService feedService) {
    this.feedService = Objects.requireNonNull(feedService);
  }

  void validate(String url, Errors errors) {
    if (url == null || !ORIGIN_PATTERN.matcher(url).matches()) {
      errors.rejectValue(FIELD_NAME, "Pattern.origin", "must begin with http(s)://");
    }
    if (!feedService.valid(url)) {
      errors.rejectValue(FIELD_NAME, "ValidSyndication.url", "invalid syndication feed");
    }
  }
}
