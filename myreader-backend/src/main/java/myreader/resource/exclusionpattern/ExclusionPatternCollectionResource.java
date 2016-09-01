package myreader.resource.exclusionpattern;

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
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import spring.hateoas.ResourceAssemblers;

import javax.validation.Valid;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "api/2/exclusions/{id}/pattern")
public class ExclusionPatternCollectionResource {

    private final ResourceAssemblers resourceAssemblers;
    private final ExclusionRepository exclusionRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    public ExclusionPatternCollectionResource(final ResourceAssemblers resourceAssemblers, final ExclusionRepository exclusionRepository, final SubscriptionRepository subscriptionRepository) {
        this.resourceAssemblers = resourceAssemblers;
        this.exclusionRepository = exclusionRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    @ModelAttribute("subscription")
    public Subscription model(@PathVariable("id") Long id) {
        Subscription subscription = subscriptionRepository.findByIdAndCurrentUser(id);
        if(subscription == null) {
            throw new ResourceNotFoundException();
        }
        return subscription;
    }

    @RequestMapping(method = GET)
    public PagedResources<ExclusionPatternGetResponse> get(@ModelAttribute("subscription") Subscription subscription, Pageable pageable) {
        Page<ExclusionPattern> exclusionPatternPage = exclusionRepository.findBySubscriptionId(subscription.getId(), pageable);
        return resourceAssemblers.toResource(exclusionPatternPage, ExclusionPatternGetResponse.class);
    }

    @RequestMapping(method = POST)
    public ExclusionPatternGetResponse post(@ModelAttribute("subscription") Subscription subscription, @Valid @RequestBody ExclusionPatternPostRequest request) {

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
