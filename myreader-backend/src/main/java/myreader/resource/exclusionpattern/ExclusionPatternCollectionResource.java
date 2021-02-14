package myreader.resource.exclusionpattern;

import myreader.entity.ExclusionPattern;
import myreader.repository.ExclusionRepository;
import myreader.repository.SubscriptionRepository;
import myreader.resource.ResourceConstants;
import myreader.resource.exclusionpattern.assembler.ExclusionPatternGetResponseAssembler;
import myreader.resource.exclusionpattern.beans.ExclusionPatternGetResponse;
import myreader.resource.exclusionpattern.beans.ExclusionPatternPostRequest;
import myreader.resource.exclusionpattern.beans.ExclusionPatternPostRequestValidator;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;

@RestController
public class ExclusionPatternCollectionResource {

  private final ExclusionPatternGetResponseAssembler assembler;
  private final ExclusionRepository exclusionRepository;
  private final SubscriptionRepository subscriptionRepository;

  public ExclusionPatternCollectionResource(
    ExclusionPatternGetResponseAssembler assembler,
    ExclusionRepository exclusionRepository,
    SubscriptionRepository subscriptionRepository
  ) {
    this.assembler = assembler;
    this.exclusionRepository = exclusionRepository;
    this.subscriptionRepository = subscriptionRepository;
  }

  @InitBinder
  public void binder(WebDataBinder binder) {
    binder.addValidators(new ExclusionPatternPostRequestValidator());
  }

  @GetMapping(ResourceConstants.EXCLUSIONS_PATTERN)
  public Map<String, List<ExclusionPatternGetResponse>> get(@PathVariable("id") Long id) {
    var subscription = subscriptionRepository
      .findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    var source = exclusionRepository.findBySubscriptionId(subscription.getId());
    var target = source.stream().map(assembler::toModel).collect(toList());

    Map<String, List<ExclusionPatternGetResponse>> body = new HashMap<>(3);
    body.put("content", target);
    return body;
  }

  @PostMapping(ResourceConstants.EXCLUSIONS_PATTERN)
  public ExclusionPatternGetResponse post(
    @PathVariable("id") Long id,
    @Validated @RequestBody ExclusionPatternPostRequest request
  ) {
    var subscription = subscriptionRepository
      .findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    var exclusionPattern = exclusionRepository.findBySubscriptionIdAndPattern(subscription.getId(), request.getPattern());

    if (exclusionPattern == null) {
      exclusionPattern = new ExclusionPattern();
      exclusionPattern.setPattern(request.getPattern());
      exclusionPattern.setSubscription(subscription);
      exclusionPattern = exclusionRepository.save(exclusionPattern);
    }

    return assembler.toModel(exclusionPattern);
  }
}
