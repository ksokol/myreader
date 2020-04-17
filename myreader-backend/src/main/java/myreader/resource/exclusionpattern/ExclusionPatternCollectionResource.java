package myreader.resource.exclusionpattern;

import myreader.entity.ExclusionPattern;
import myreader.entity.Subscription;
import myreader.repository.ExclusionRepository;
import myreader.repository.SubscriptionRepository;
import myreader.resource.ResourceConstants;
import myreader.resource.exclusionpattern.beans.ExclusionPatternGetResponse;
import myreader.resource.exclusionpattern.beans.ExclusionPatternPostRequest;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(ResourceConstants.EXCLUSIONS_PATTERN)
public class ExclusionPatternCollectionResource {

    private final RepresentationModelAssembler<ExclusionPattern, ExclusionPatternGetResponse> assembler;
    private final ExclusionRepository exclusionRepository;
    private final SubscriptionRepository subscriptionRepository;

    public ExclusionPatternCollectionResource(
            RepresentationModelAssembler<ExclusionPattern, ExclusionPatternGetResponse> assembler,
            ExclusionRepository exclusionRepository,
            SubscriptionRepository subscriptionRepository
    ) {
        this.assembler = assembler;
        this.exclusionRepository = exclusionRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    @ModelAttribute("subscription")
    public Subscription model(@PathVariable("id") Long id) {
        Subscription subscription = subscriptionRepository.findByIdAndCurrentUser(id);
        if (subscription == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return subscription;
    }

    @GetMapping
    public Map<String, List<ExclusionPatternGetResponse>> get(@ModelAttribute("subscription") Subscription subscription) {
        List<ExclusionPattern> source = exclusionRepository.findBySubscriptionId(subscription.getId());
        List<ExclusionPatternGetResponse> target = source.stream().map(assembler::toModel).collect(toList());

        Map<String, List<ExclusionPatternGetResponse>> body = new HashMap<>(3);
        body.put("content", target);
        return body;
    }

    @PostMapping
    public ExclusionPatternGetResponse post(
            @ModelAttribute("subscription") Subscription subscription,
            @Valid @RequestBody ExclusionPatternPostRequest request
    ) {
        ExclusionPattern exclusionPattern = exclusionRepository.findBySubscriptionIdAndPattern(subscription.getId(), request.getPattern());

        if (exclusionPattern == null) {
            exclusionPattern = new ExclusionPattern();
            exclusionPattern.setPattern(request.getPattern());
            exclusionPattern.setSubscription(subscription);
            exclusionPattern = exclusionRepository.save(exclusionPattern);
        }

        return assembler.toModel(exclusionPattern);
    }
}
