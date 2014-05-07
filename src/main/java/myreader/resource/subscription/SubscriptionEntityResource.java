package myreader.resource.subscription;

import myreader.entity.Subscription;
import myreader.repository.SubscriptionRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.service.patch.PatchService;
import myreader.resource.subscription.assembler.SubscriptionGetResponseAssembler;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscription.beans.SubscriptionPatchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@Controller
@RequestMapping(value = "subscriptions", produces = MediaType.APPLICATION_JSON_VALUE)
public class SubscriptionEntityResource {

    private final SubscriptionGetResponseAssembler subscriptionAssembler = new SubscriptionGetResponseAssembler(SubscriptionEntityResource.class);
    private final SubscriptionRepository subscriptionRepository;
    private final PatchService patchService;

    @Autowired
    public SubscriptionEntityResource(SubscriptionRepository subscriptionService, PatchService patchService) {
        this.subscriptionRepository = subscriptionService;
        this.patchService = patchService;
    }

    @ModelAttribute
    public Subscription find(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user) {
        Subscription subscription = subscriptionRepository.findByIdAndUsername(id, user.getUsername());
        if(subscription == null) {
            throw new ResourceNotFoundException();
        }
        return subscription;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public SubscriptionGetResponse get(@PathVariable("id") Long id, Subscription s) {
        return subscriptionAssembler.toResource(s);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping(value = "{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void delete(Subscription s) {
        subscriptionRepository.delete(s.getId());
    }

    @RequestMapping(value = "{id}", method = RequestMethod.PATCH)
    @ResponseBody
    public SubscriptionGetResponse patch(@RequestBody SubscriptionPatchRequest request, Subscription subscription) {
        Subscription patchedSubscription = patchService.patch(request, subscription);
        subscriptionRepository.save(patchedSubscription);
        return get(patchedSubscription.getId(), patchedSubscription);
    }
}
