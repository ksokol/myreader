package myreader.resource.subscription;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionTag;
import myreader.repository.FeedRepository;
import myreader.repository.SubscriptionRepository;
import myreader.repository.SubscriptionTagRepository;
import myreader.resource.ResourceConstants;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscription.beans.SubscriptionPatchRequest;
import myreader.resource.subscription.beans.SubscriptionPatchRequestValidator;
import myreader.service.feed.FeedService;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.http.HttpStatus;
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
  private final FeedService feedService;
  private final FeedRepository feedRepository;
  private final RepresentationModelAssembler<Subscription, SubscriptionGetResponse> assembler;

  public SubscriptionEntityResource(
    RepresentationModelAssembler<Subscription, SubscriptionGetResponse> assembler,
    SubscriptionTagRepository subscriptionTagRepository,
    SubscriptionRepository subscriptionRepository,
    FeedService feedService, FeedRepository feedRepository
  ) {
    this.assembler = assembler;
    this.subscriptionRepository = subscriptionRepository;
    this.subscriptionTagRepository = subscriptionTagRepository;
    this.feedService = feedService;
    this.feedRepository = feedRepository;
  }

  @InitBinder
  public void binder(WebDataBinder binder) {
    binder.addValidators(new SubscriptionPatchRequestValidator(feedService));
  }

  @GetMapping(ResourceConstants.SUBSCRIPTION)
  public SubscriptionGetResponse get(@PathVariable("id") Long id) {
    return subscriptionRepository
      .findById(id)
      .map(assembler::toModel)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping(ResourceConstants.SUBSCRIPTION)
  public void delete(@PathVariable("id") Long id) {
    var subscription = subscriptionRepository
      .findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    subscriptionRepository.delete(subscription);

    var subscriptionTag = subscription.getSubscriptionTag();
    if (subscriptionTag != null && subscriptionTagRepository.countBySubscriptions(subscriptionTag.getId()) == 0) {
      subscriptionTagRepository.delete(subscriptionTag);
    }

    feedRepository.delete(subscription.getFeed());
  }

  @Transactional
  @PatchMapping(ResourceConstants.SUBSCRIPTION)
  public SubscriptionGetResponse patch(
    @PathVariable("id") Long id,
    @Validated @RequestBody SubscriptionPatchRequest request
  ) {
    var subscription = subscriptionRepository
      .findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    subscription.setTitle(request.getTitle());
    subscription.getFeed().setUrl(request.getOrigin());

    if (request.getFeedTag() != null) {
      var feedTag = request.getFeedTag();
      var name = feedTag.getName();

      var subscriptionTag = subscriptionTagRepository
        .findByTag(name)
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

    return get(id);
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
