package myreader.resource.exclusionpattern;

import javax.validation.Valid;

import myreader.entity.ExclusionPattern;
import myreader.entity.Subscription;
import myreader.repository.ExclusionRepository;
import myreader.repository.SubscriptionRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.exclusionpattern.beans.ExclusionPatternGetResponse;
import myreader.resource.exclusionpattern.beans.ExclusionPatternPostRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedResources;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import spring.hateoas.ResourceAssemblers;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "/exclusions/{id}/pattern")
public class ExclusionPatternCollectionResource {

    private final ExclusionRepository exclusionRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final ResourceAssemblers resourceAssemblers;

    @Autowired
    public ExclusionPatternCollectionResource(ExclusionRepository exclusionRepository, SubscriptionRepository subscriptionRepository, ResourceAssemblers resourceAssemblers) {
        this.exclusionRepository = exclusionRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.resourceAssemblers = resourceAssemblers;
    }

    @ModelAttribute("subscription")
    Subscription model(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user) {
        Subscription subscription = subscriptionRepository.findByIdAndUsername(id, user.getUsername());
        if(subscription == null) {
            throw new ResourceNotFoundException();
        }
        return subscription;
    }

    @RequestMapping(value="", method = RequestMethod.GET)
    public PagedResources<ExclusionPatternGetResponse> get(@ModelAttribute("subscription") Subscription subscription, Pageable pageable) {
        Page<ExclusionPattern> exclusionPatternPage = exclusionRepository.findBySubscriptionId(subscription.getId(), pageable);
        return resourceAssemblers.toPagedResource(exclusionPatternPage, ExclusionPatternGetResponse.class);
    }

    @RequestMapping(value="", method = RequestMethod.POST)
    public ExclusionPatternGetResponse post(@ModelAttribute("subscription") Subscription subscription, @Valid @RequestBody ExclusionPatternPostRequest
            request) {

        ExclusionPattern exclusionPattern = exclusionRepository.findBySubscriptionIdAndPattern(subscription.getId(), request.getPattern());

        if (exclusionPattern == null) {
            exclusionPattern = new ExclusionPattern();
            exclusionPattern.setPattern(request.getPattern());
            exclusionPattern.setSubscription(subscription);
            exclusionPattern = exclusionRepository.save(exclusionPattern);
        }

        return resourceAssemblers.toResource(exclusionPattern, ExclusionPatternGetResponse.class);
    }
}
