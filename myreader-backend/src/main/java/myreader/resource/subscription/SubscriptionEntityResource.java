package myreader.resource.subscription;

import myreader.entity.FetchError;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionTag;
import myreader.repository.FetchErrorRepository;
import myreader.repository.SubscriptionRepository;
import myreader.repository.SubscriptionTagRepository;
import myreader.resource.ResourceConstants;
import myreader.resource.subscription.beans.FetchErrorGetResponse;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscription.beans.SubscriptionPatchRequest;
import myreader.resource.subscription.beans.SubscriptionPatchRequestValidator;
import myreader.service.subscription.SubscriptionService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
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

import static myreader.resource.ResourceConstants.FEED_FETCH_ERROR;

@RestController
public class SubscriptionEntityResource {

  private final SubscriptionRepository subscriptionRepository;
  private final SubscriptionTagRepository subscriptionTagRepository;
  private final SubscriptionService subscriptionService;
  private final RepresentationModelAssembler<FetchError, FetchErrorGetResponse> fetchErrorAssembler;
  private final FetchErrorRepository fetchErrorRepository;
  private final RepresentationModelAssembler<Subscription, SubscriptionGetResponse> assembler;
  private final PagedResourcesAssembler<FetchError> pagedResourcesAssembler;

  public SubscriptionEntityResource(
    RepresentationModelAssembler<Subscription, SubscriptionGetResponse> assembler,
    SubscriptionTagRepository subscriptionTagRepository,
    SubscriptionRepository subscriptionRepository,
    SubscriptionService subscriptionService,
    RepresentationModelAssembler<FetchError, FetchErrorGetResponse> fetchErrorAssembler,
    FetchErrorRepository fetchErrorRepository,
    PagedResourcesAssembler<FetchError> pagedResourcesAssembler
  ) {
    this.assembler = assembler;
    this.subscriptionRepository = subscriptionRepository;
    this.subscriptionTagRepository = subscriptionTagRepository;
    this.subscriptionService = subscriptionService;
    this.fetchErrorAssembler = fetchErrorAssembler;
    this.fetchErrorRepository = fetchErrorRepository;
    this.pagedResourcesAssembler = pagedResourcesAssembler;
  }

  @InitBinder
  public void binder(WebDataBinder binder) {
    binder.addValidators(new SubscriptionPatchRequestValidator(subscriptionService));
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
    subscription.setUrl(request.getOrigin());

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

  @GetMapping(FEED_FETCH_ERROR)
  public PagedModel<FetchErrorGetResponse> getFetchError(@PathVariable("id") Long id, Pageable pageable) {
    var page = fetchErrorRepository.findBySubscriptionIdOrderByCreatedAtDesc(id, pageable);
    return pagedResourcesAssembler.toModel(page, fetchErrorAssembler);
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
