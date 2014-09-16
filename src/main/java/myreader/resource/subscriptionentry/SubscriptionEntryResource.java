package myreader.resource.subscriptionentry;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.service.patch.PatchService;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import spring.data.ResourceAssemblers;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping("subscriptionEntries")
public class SubscriptionEntryResource {

    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final ResourceAssemblers resourceAssemblers;
    private final PatchService patchService;

    @Autowired
    public SubscriptionEntryResource(SubscriptionEntryRepository subscriptionEntryRepository, ResourceAssemblers resourceAssemblers, PatchService patchService) {
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.resourceAssemblers = resourceAssemblers;
        this.patchService = patchService;
    }

    @ModelAttribute
    SubscriptionEntry find(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user) {
        SubscriptionEntry entry = subscriptionEntryRepository.findByIdAndUsername(id, user.getUsername());
        if(entry == null) {
            throw new ResourceNotFoundException();
        }
        return entry;
    }

    @RequestMapping(value= "{id}", method = RequestMethod.GET)
    public SubscriptionEntryGetResponse get(@PathVariable("id") Long id, SubscriptionEntry subscriptionEntry) {
        return resourceAssemblers.toResource(subscriptionEntry, SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(value= "{id}", method = RequestMethod.PATCH)
    public SubscriptionEntryGetResponse patch(@PathVariable("id") Long id, @RequestBody SubscriptionEntryPatchRequest request, SubscriptionEntry subscriptionEntry) {
        SubscriptionEntry patched = patchService.patch(request, subscriptionEntry);
        subscriptionEntryRepository.save(patched);
        return resourceAssemblers.toResource(patched, SubscriptionEntryGetResponse.class);
    }

}
