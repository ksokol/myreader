package myreader.resource.subscriptionentry;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.service.patch.PatchService;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import spring.hateoas.ResourceAssemblers;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.PATCH;

/**
 * @author Kamill Sokol
 */
@Transactional
@RestController
@RequestMapping("api/2/subscriptionEntries/{id}")
public class SubscriptionEntryEntityResource {

    private final ResourceAssemblers resourceAssemblers;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final PatchService patchService;

    @Autowired
    public SubscriptionEntryEntityResource(final ResourceAssemblers resourceAssemblers, final SubscriptionRepository subscriptionRepository, final SubscriptionEntryRepository subscriptionEntryRepository, final PatchService patchService) {
        this.resourceAssemblers = resourceAssemblers;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.patchService = patchService;
    }

    @RequestMapping(method = GET)
    public SubscriptionEntryGetResponse get(@PathVariable("id") Long id) {
        final SubscriptionEntry subscriptionEntry = findOrThrowException(id);
        return resourceAssemblers.toResource(subscriptionEntry, SubscriptionEntryGetResponse.class);
    }

    @Transactional
    @RequestMapping(method = PATCH)
    public SubscriptionEntryGetResponse patch(@PathVariable("id") Long id, @RequestBody SubscriptionEntryPatchRequest request) {
        final SubscriptionEntry subscriptionEntry = findOrThrowException(id);

        if(request.isFieldPatched("seen") && request.getSeen() != subscriptionEntry.isSeen()) {
            if (request.getSeen()) {
                subscriptionRepository.decrementUnseen(subscriptionEntry.getSubscription().getId());
            } else {
                subscriptionRepository.incrementUnseen(subscriptionEntry.getSubscription().getId());
            }
        }

        SubscriptionEntry patched = patchService.patch(request, subscriptionEntry);
        subscriptionEntryRepository.save(patched);

        return get(id);
    }

    private SubscriptionEntry findOrThrowException(Long id) {
        SubscriptionEntry entry = subscriptionEntryRepository.findByIdAndCurrentUser(id);
        if(entry == null) {
            throw new ResourceNotFoundException();
        }
        return entry;
    }
}
