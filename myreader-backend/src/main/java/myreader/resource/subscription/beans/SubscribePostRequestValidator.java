package myreader.resource.subscription.beans;

import myreader.repository.SubscriptionRepository;
import myreader.service.subscription.SubscriptionService;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.util.Objects;

public class SubscribePostRequestValidator implements Validator {

  private static final String FIELD_NAME = "origin";

  private final SubscriptionRepository subscriptionRepository;
  private final SubscriptionService subscriptionService;

  public SubscribePostRequestValidator(SubscriptionRepository subscriptionRepository, SubscriptionService subscriptionService) {
    this.subscriptionRepository = Objects.requireNonNull(subscriptionRepository, "subscriptionRepository is null");
    this.subscriptionService = Objects.requireNonNull(subscriptionService, "subscriptionService is null");
  }

  @Override
  public boolean supports(Class<?> clazz) {
    return SubscribePostRequest.class.equals(clazz);
  }

  @Override
  public void validate(Object target, Errors errors) {
    SubscribePostRequest request = (SubscribePostRequest) target;
    String origin = request.getOrigin();

    if (!subscriptionService.valid(origin)) {
      errors.rejectValue(FIELD_NAME, "ValidSyndication.url", "invalid syndication feed");
    }

    if (subscriptionRepository.findByUrl(origin).isPresent()) {
      errors.rejectValue(FIELD_NAME, "UniqueSubscription.origin", "subscription exists");
    }
  }
}
