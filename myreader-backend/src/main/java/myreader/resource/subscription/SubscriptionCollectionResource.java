package myreader.resource.subscription;

import myreader.entity.Subscription;
import myreader.repository.SubscriptionRepository;
import myreader.resource.ResourceConstants;
import myreader.resource.subscription.beans.SubscribePostRequest;
import myreader.resource.subscription.beans.SubscribePostRequestValidator;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.service.subscription.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
public class SubscriptionCollectionResource {

  private final SubscriptionService subscriptionService;
  private final SubscriptionRepository subscriptionRepository;
  private final RepresentationModelAssembler<Subscription, SubscriptionGetResponse> assembler;

  @Autowired
  public SubscriptionCollectionResource(
    RepresentationModelAssembler<Subscription, SubscriptionGetResponse> assembler,
    SubscriptionService subscriptionService,
    SubscriptionRepository subscriptionRepository
  ) {
    this.assembler = assembler;
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

  @GetMapping(ResourceConstants.SUBSCRIPTIONS)
  public Map<String, Object> get(@RequestParam(value = "unseenGreaterThan", required = false, defaultValue = "-1") long unseenCount) {
    var source = subscriptionRepository.findAllByUnseenGreaterThan(unseenCount);
    var target = new ArrayList<>(source.size());
    for (var subscription : source) {
      target.add(assembler.toModel(subscription));
    }
    var body = new HashMap<String, Object>(2);
    body.put("content", target);
    return body;
  }
}
