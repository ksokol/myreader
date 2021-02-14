package myreader.resource.subscriptiontag;

import myreader.repository.SubscriptionRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;
import java.util.Set;

import static myreader.resource.ResourceConstants.SUBSCRIPTION_TAGS;

@RestController
public class SubscriptionTagCollectionResource {

  private final SubscriptionRepository subscriptionRepository;

  public SubscriptionTagCollectionResource(SubscriptionRepository subscriptionRepository) {
    this.subscriptionRepository = Objects.requireNonNull(subscriptionRepository, "subscriptionRepository is null");
  }

  @GetMapping(SUBSCRIPTION_TAGS)
  public Set<String> get() {
    return subscriptionRepository.findDistinctTags();
  }
}
