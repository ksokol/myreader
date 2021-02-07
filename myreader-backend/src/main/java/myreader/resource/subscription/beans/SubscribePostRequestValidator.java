package myreader.resource.subscription.beans;

import myreader.repository.SubscriptionRepository;
import myreader.service.feed.FeedService;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import static java.util.Objects.requireNonNull;

public class SubscribePostRequestValidator implements Validator {

  private static final String FIELD_NAME = "origin";

  private final SubscriptionRepository subscriptionRepository;
  private final UrlValidator urlValidator;

  public SubscribePostRequestValidator(SubscriptionRepository subscriptionRepository, FeedService feedService) {
    this.subscriptionRepository = requireNonNull(subscriptionRepository, "subscriptionRepository is null");
    urlValidator = new UrlValidator(requireNonNull(feedService, "feedService is null"));
  }

  @Override
  public boolean supports(Class<?> clazz) {
    return SubscribePostRequest.class.equals(clazz);
  }

  @Override
  public void validate(Object target, Errors errors) {
    SubscribePostRequest request = (SubscribePostRequest) target;
    String origin = request.getOrigin();

    urlValidator.validate(request.getOrigin(), errors);

    if (subscriptionRepository.findByFeedUrl(origin).isPresent()) {
      errors.rejectValue(FIELD_NAME, "UniqueSubscription.origin", "subscription exists");
    }
  }
}
