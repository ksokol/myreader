package myreader.resource.subscription;

import myreader.repository.SubscriptionRepository;
import myreader.resource.ResourceConstants;
import myreader.resource.subscription.beans.SubscribePostRequest;
import myreader.resource.subscription.beans.SubscribePostRequestValidator;
import myreader.service.subscription.SubscriptionService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class SubscriptionCollectionResource {

  private final SubscriptionService subscriptionService;
  private final SubscriptionRepository subscriptionRepository;

  public SubscriptionCollectionResource(
    SubscriptionService subscriptionService,
    SubscriptionRepository subscriptionRepository
  ) {
    this.subscriptionService = subscriptionService;
    this.subscriptionRepository = subscriptionRepository;
  }

  @InitBinder
  protected void binder(WebDataBinder binder) {
    binder.addValidators(new SubscribePostRequestValidator(subscriptionRepository, subscriptionService));
  }

  @PostMapping(ResourceConstants.SUBSCRIPTIONS)
  public Map<String, Object> post(
    @Validated @RequestBody SubscribePostRequest request
  ) {
    var subscription = subscriptionService.subscribe(request.getOrigin());
    var body = new HashMap<String, Object>(2);
    body.put("uuid", subscription.getId());
    return body;
  }
}
