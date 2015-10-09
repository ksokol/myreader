package myreader.resource.subscriptionentry;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.resource.service.patch.PatchService;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryBatchPatchRequest;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponseSlice;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;
import myreader.resource.subscriptionentry.converter.SubscriptionEntryGetResponseSliceConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.hateoas.Resources;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import spring.hateoas.ResourceAssemblers;
import spring.security.MyReaderUser;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.validation.Valid;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "api/2/subscriptionEntries")
public class SubscriptionEntryCollectionResource {

    private final ResourceAssemblers resourceAssemblers;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final PatchService patchService;
    private final SubscriptionEntryGetResponseSliceConverter subscriptionEntryGetResponseSliceConverter;

    @Autowired
    public SubscriptionEntryCollectionResource(final ResourceAssemblers resourceAssemblers, final SubscriptionRepository subscriptionRepository, final SubscriptionEntryRepository subscriptionEntryRepository, final PatchService patchService, final SubscriptionEntryGetResponseSliceConverter subscriptionEntryGetResponseSliceConverter) {
        this.resourceAssemblers = resourceAssemblers;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.patchService = patchService;
        this.subscriptionEntryGetResponseSliceConverter = subscriptionEntryGetResponseSliceConverter;
    }

    @RequestMapping(method = GET)
    public SubscriptionEntryGetResponseSlice get(@RequestParam Map<String, Object> params, @AuthenticationPrincipal MyReaderUser user) {
        final Slice<SubscriptionEntry> pagedEntries = subscriptionEntryRepository.findBy(params, user.getId());
        return subscriptionEntryGetResponseSliceConverter.convert(pagedEntries, params);
    }

    @RequestMapping(value= "availableTags", method = GET)
    public Set<String> tags(@AuthenticationPrincipal MyReaderUser user) {
        return subscriptionEntryRepository.findDistinctTags(user.getId());
    }

    //TODO remove RequestMethod.PUT after Android 2.x phased out
    @Transactional
    @RequestMapping(method = {RequestMethod.PATCH, RequestMethod.PUT})
    public Resources<SubscriptionEntryGetResponse> patch(@Valid @RequestBody SubscriptionEntryBatchPatchRequest request, @AuthenticationPrincipal MyReaderUser user) {
        List<SubscriptionEntryGetResponse> subscriptionEntryGetResponses = new ArrayList<>();

        for (final SubscriptionEntryPatchRequest subscriptionPatch : request.getContent()) {
            SubscriptionEntry subscriptionEntry = subscriptionEntryRepository.findByIdAndUsername(Long.valueOf(subscriptionPatch.getUuid()), user.getUsername());
            if(subscriptionEntry == null) {
                continue;
            }

            if(subscriptionPatch.isFieldPatched("seen") && subscriptionPatch.getSeen() != subscriptionEntry.isSeen()) {
                if (subscriptionPatch.getSeen()) {
                    subscriptionRepository.decrementUnseen(subscriptionEntry.getSubscription().getId());
                } else {
                    subscriptionRepository.incrementUnseen(subscriptionEntry.getSubscription().getId());
                }
            }

            SubscriptionEntry patched = patchService.patch(subscriptionPatch, subscriptionEntry);
            SubscriptionEntry saved = subscriptionEntryRepository.save(patched);
            SubscriptionEntryGetResponse subscriptionEntryGetResponse = resourceAssemblers.toResource(saved, SubscriptionEntryGetResponse.class);
            subscriptionEntryGetResponses.add(subscriptionEntryGetResponse);
        }

        return new Resources<>(subscriptionEntryGetResponses);
    }
}
