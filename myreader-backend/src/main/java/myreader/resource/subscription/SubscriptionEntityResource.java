package myreader.resource.subscription;

import myreader.repository.FetchErrorRepository;
import myreader.repository.SubscriptionRepository;
import myreader.resource.ResourceConstants;
import myreader.resource.subscription.assembler.FetchErrorGetResponseAssembler;
import myreader.resource.subscription.assembler.SubscriptionGetResponseAssembler;
import myreader.resource.subscription.beans.FetchErrorGetResponse;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscription.beans.SubscriptionPatchRequest;
import myreader.resource.subscription.beans.SubscriptionPatchRequestValidator;
import myreader.service.subscription.SubscriptionService;
import org.springframework.http.HttpStatus;
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

import java.util.List;
import java.util.stream.Collectors;

import static myreader.resource.ResourceConstants.FEED_FETCH_ERROR;

@RestController
public class SubscriptionEntityResource {

  private final SubscriptionRepository subscriptionRepository;
  private final SubscriptionService subscriptionService;
  private final FetchErrorGetResponseAssembler fetchErrorAssembler;
  private final FetchErrorRepository fetchErrorRepository;
  private final SubscriptionGetResponseAssembler assembler;

  public SubscriptionEntityResource(
    SubscriptionGetResponseAssembler assembler,
    SubscriptionRepository subscriptionRepository,
    SubscriptionService subscriptionService,
    FetchErrorGetResponseAssembler fetchErrorAssembler,
    FetchErrorRepository fetchErrorRepository
  ) {
    this.assembler = assembler;
    this.subscriptionRepository = subscriptionRepository;
    this.subscriptionService = subscriptionService;
    this.fetchErrorAssembler = fetchErrorAssembler;
    this.fetchErrorRepository = fetchErrorRepository;
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
  }

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
    subscription.setTag(request.getTag());
    subscription.setColor(request.getColor());

    subscriptionRepository.save(subscription);

    return get(id);
  }

  @GetMapping(FEED_FETCH_ERROR)
  public List<FetchErrorGetResponse> getFetchError(@PathVariable("id") Long id) {
    return fetchErrorRepository.findAllBySubscriptionIdOrderByCreatedAtDesc(id).stream()
      .map(fetchErrorAssembler::toModel)
      .collect(Collectors.toList());
  }
}
