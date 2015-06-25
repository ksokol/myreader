package myreader.resource.subscriptionentry;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.PATCH;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.service.patch.PatchService;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@Transactional
@RestController
@RequestMapping("subscriptionEntries/{id}")
public class SubscriptionEntryEntityResource {

    private final ConversionService conversionService;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final PatchService patchService;

    @Autowired
    public SubscriptionEntryEntityResource(final ConversionService conversionService, final SubscriptionRepository subscriptionRepository, final SubscriptionEntryRepository subscriptionEntryRepository, final PatchService patchService) {
        this.conversionService = conversionService;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.patchService = patchService;
    }

    @RequestMapping(method = GET)
    public SubscriptionEntryGetResponse get(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user) {
        final SubscriptionEntry subscriptionEntry = findOrThrowException(id, user.getUsername());
        return conversionService.convert(subscriptionEntry, SubscriptionEntryGetResponse.class);
    }

    @Transactional
    @RequestMapping(method = PATCH)
    public SubscriptionEntryGetResponse patch(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user, @RequestBody SubscriptionEntryPatchRequest request) {
        final SubscriptionEntry subscriptionEntry = findOrThrowException(id, user.getUsername());

        if(request.isFieldPatched("seen")) {
            if(request.getSeen() != subscriptionEntry.isSeen()) {
                if (request.getSeen()) {
                    subscriptionRepository.decrementUnseen(subscriptionEntry.getSubscription().getId());
                } else {
                    subscriptionRepository.incrementUnseen(subscriptionEntry.getSubscription().getId());
                }
            }
        }

        SubscriptionEntry patched = patchService.patch(request, subscriptionEntry);
        subscriptionEntryRepository.save(patched);

        return get(id, user);
    }

    private SubscriptionEntry findOrThrowException(Long id, String username) {
        SubscriptionEntry entry = subscriptionEntryRepository.findByIdAndUsername(id, username);
        if(entry == null) {
            throw new ResourceNotFoundException();
        }
        return entry;
    }
}
