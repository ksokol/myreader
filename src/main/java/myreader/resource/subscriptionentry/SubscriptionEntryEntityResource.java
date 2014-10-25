package myreader.resource.subscriptionentry;

import static myreader.Constants.ID;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.PATCH;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.service.patch.PatchService;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import spring.hateoas.ResourceAssemblers;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@Transactional
@RestController
@RequestMapping("subscriptionEntries/{" + ID + "}")
public class SubscriptionEntryEntityResource {

    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final ResourceAssemblers resourceAssemblers;
    private final PatchService patchService;

    @Autowired
    public SubscriptionEntryEntityResource(SubscriptionEntryRepository subscriptionEntryRepository, ResourceAssemblers resourceAssemblers, PatchService patchService) {
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.resourceAssemblers = resourceAssemblers;
        this.patchService = patchService;
    }

    @RequestMapping(method = GET)
    public SubscriptionEntryGetResponse get(@PathVariable(ID) Long id, @AuthenticationPrincipal MyReaderUser user) {
        return resourceAssemblers.toResource(findOrThrowException(id, user.getUsername()), SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(method = PATCH)
    public SubscriptionEntryGetResponse patch(@PathVariable(ID) Long id, @AuthenticationPrincipal MyReaderUser user,
                                              @RequestBody SubscriptionEntryPatchRequest request) {
        SubscriptionEntry patched = patchService.patch(request, findOrThrowException(id, user.getUsername()));
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
