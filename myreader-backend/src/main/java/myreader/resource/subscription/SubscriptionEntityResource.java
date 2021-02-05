package myreader.resource.subscription;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionTag;
import myreader.repository.SubscriptionRepository;
import myreader.repository.SubscriptionTagRepository;
import myreader.resource.ResourceConstants;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscription.beans.SubscriptionPatchRequest;
import myreader.resource.subscription.beans.SubscriptionPatchRequestValidator;
import myreader.security.AuthenticatedUser;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class SubscriptionEntityResource {

  private final SubscriptionRepository subscriptionRepository;
  private final SubscriptionTagRepository subscriptionTagRepository;
  private final RepresentationModelAssembler<Subscription, SubscriptionGetResponse> assembler;

  public SubscriptionEntityResource(
    RepresentationModelAssembler<Subscription, SubscriptionGetResponse> assembler,
    SubscriptionTagRepository subscriptionTagRepository,
    SubscriptionRepository subscriptionRepository
  ) {
    this.assembler = assembler;
    this.subscriptionRepository = subscriptionRepository;
    this.subscriptionTagRepository = subscriptionTagRepository;
  }

  @InitBinder
  public void binder(WebDataBinder binder) {
    binder.addValidators(new SubscriptionPatchRequestValidator());
  }

  @GetMapping(ResourceConstants.SUBSCRIPTION)
  public SubscriptionGetResponse get(
    @PathVariable("id") Long id,
    @AuthenticationPrincipal AuthenticatedUser authenticatedUser
  ) {
    return subscriptionRepository
      .findByIdAndUserId(id, authenticatedUser.getId())
      .map(assembler::toModel)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping(ResourceConstants.SUBSCRIPTION)
  public void delete(
    @PathVariable("id") Long id,
    @AuthenticationPrincipal AuthenticatedUser authenticatedUser
  ) {
    var subscription = subscriptionRepository
      .findByIdAndUserId(id, authenticatedUser.getId())
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    subscriptionRepository.delete(subscription);

    var subscriptionTag = subscription.getSubscriptionTag();
    if (subscriptionTag != null && subscriptionTagRepository.countBySubscriptions(subscriptionTag.getId()) == 0) {
      subscriptionTagRepository.delete(subscriptionTag);
    }
  }

  @Transactional
  @PatchMapping(ResourceConstants.SUBSCRIPTION)
  public SubscriptionGetResponse patch(
    @PathVariable("id") Long id,
    @Validated @RequestBody SubscriptionPatchRequest request,
    @AuthenticationPrincipal AuthenticatedUser authenticatedUser
  ) {
    var subscription = subscriptionRepository
      .findByIdAndUserId(id, authenticatedUser.getId())
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    subscription.setTitle(request.getTitle());

    if (request.getFeedTag() != null) {
      var feedTag = request.getFeedTag();
      var name = feedTag.getName();

      var subscriptionTag = subscriptionTagRepository
        .findByTagAndUserId(name, authenticatedUser.getId())
        .orElse(new SubscriptionTag(name, subscription));

      if (!subscriptionTag.equals(subscription.getSubscriptionTag())) {
          deleteOrphanedSubscriptionTag(subscription);
      }

      if (feedTag.getColor() != null) {
        subscriptionTag.setColor(feedTag.getColor());
      }

      subscriptionTagRepository.save(subscriptionTag);
      subscription.setSubscriptionTag(subscriptionTag);
      subscriptionRepository.save(subscription);
    } else {
      deleteOrphanedSubscriptionTag(subscription);
    }

    return get(id, authenticatedUser);
  }

  private void deleteOrphanedSubscriptionTag(Subscription subscription) {
    var subscriptionTag = subscription.getSubscriptionTag();
    subscription.setSubscriptionTag(null);
    subscriptionRepository.save(subscription);

    if (subscriptionTag != null && subscriptionTagRepository.countBySubscriptions(subscriptionTag.getId()) == 0) {
      subscriptionTagRepository.delete(subscriptionTag);
    }
  }
}
