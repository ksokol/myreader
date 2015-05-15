package myreader.resource.subscriptionentry;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.PATCH;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.resource.RestControllerSupport;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.service.patch.PatchService;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;
import spring.hateoas.ResourceAssemblers;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@Transactional
@RestController
@RequestMapping("subscriptionEntries/{id}")
public class SubscriptionEntryEntityResource extends RestControllerSupport {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final PatchService patchService;

    @Autowired
    public SubscriptionEntryEntityResource(SubscriptionEntryRepository subscriptionEntryRepository, ResourceAssemblers resourceAssemblers, final SubscriptionRepository subscriptionRepository, PatchService patchService) {
        super(resourceAssemblers);
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.patchService = patchService;
    }

    @RequestMapping(method = GET)
    public SubscriptionEntryGetResponse get(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user) {
        return resourceAssemblers.toResource(findOrThrowException(id, user.getUsername()), SubscriptionEntryGetResponse.class);
    }

    @Transactional
    @RequestMapping(method = PATCH)
    public SubscriptionEntryGetResponse patch(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user,
                                              @RequestBody SubscriptionEntryPatchRequest request) {
        final SubscriptionEntry subscriptionEntry = findOrThrowException(id, user.getUsername());

        if(request.isFieldPatched("seen") && request.getSeen() != null && request.getSeen() != subscriptionEntry.isSeen()) {
            if (request.getSeen()){
                subscriptionRepository.decrementUnseen(subscriptionEntry.getSubscription().getId());
            } else {
                subscriptionRepository.incrementUnseen(subscriptionEntry.getSubscription().getId());
            }
        }

        SubscriptionEntry patched = patchService.patch(request, subscriptionEntry);
        SubscriptionEntry saved = subscriptionEntryRepository.save(patched);
        return resourceAssemblers.toResource(saved, SubscriptionEntryGetResponse.class);
    }

    public SubscriptionEntry findOrThrowException(Long id, String username) {
        SubscriptionEntry entry = subscriptionEntryRepository.findByIdAndUsername(id, username);
        if(entry == null) {
            throw new ResourceNotFoundException();
        }
        return entry;
    }
}
