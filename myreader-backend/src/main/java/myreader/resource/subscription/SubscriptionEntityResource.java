package myreader.resource.subscription;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import myreader.entity.Subscription;
import myreader.repository.SubscriptionRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.service.patch.PatchService;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscription.beans.SubscriptionPatchRequest;
import spring.hateoas.ResourceAssemblers;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@Transactional
@RestController
@RequestMapping(value = "api/2/subscriptions/{id}")
public class SubscriptionEntityResource {

    private final ResourceAssemblers resourceAssemblers;
    private final SubscriptionRepository subscriptionRepository;
    private final PatchService patchService;

    @Autowired
    public SubscriptionEntityResource(final ResourceAssemblers resourceAssemblers, final SubscriptionRepository subscriptionRepository, final PatchService patchService) {
        this.resourceAssemblers = resourceAssemblers;
        this.subscriptionRepository = subscriptionRepository;
        this.patchService = patchService;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public SubscriptionGetResponse get(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user) {
        Subscription subscription = findOrThrowException(id, user.getUsername());
        return resourceAssemblers.toResource(subscription, SubscriptionGetResponse.class);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping(value = "", method = RequestMethod.DELETE)
    public void delete(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user) {
        subscriptionRepository.delete(findOrThrowException(id, user.getUsername()));
    }

    //TODO remove RequestMethod.PUT after Android 2.x phased out
    @RequestMapping(value = "", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public SubscriptionGetResponse patch(@PathVariable("id") Long id,@RequestBody SubscriptionPatchRequest request, @AuthenticationPrincipal MyReaderUser user) {
        Subscription subscription = findOrThrowException(id, user.getUsername());
        Subscription patchedSubscription = patchService.patch(request, subscription);
        subscriptionRepository.save(patchedSubscription);
        return get(id, user);
    }

    public Subscription findOrThrowException(Long id, String username) {
        Subscription subscription = subscriptionRepository.findByIdAndUsername(id, username);
        if(subscription == null) {
            throw new ResourceNotFoundException();
        }
        return subscription;
    }
}
