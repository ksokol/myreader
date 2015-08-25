package myreader.resource.subscriptionentry;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import myreader.entity.Identifiable;
import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.resource.service.patch.PatchService;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryBatchPatchRequest;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.hateoas.Resources;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import spring.data.domain.Sequence;
import spring.data.domain.SequenceImpl;
import spring.data.domain.SequenceRequest;
import spring.data.domain.Sequenceable;
import spring.hateoas.ResourceAssemblers;
import spring.hateoas.SequencedResources;
import spring.security.MyReaderUser;

import java.util.ArrayList;
import java.util.List;
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

    @Autowired
    public SubscriptionEntryCollectionResource(final ResourceAssemblers resourceAssemblers, final SubscriptionRepository subscriptionRepository, final SubscriptionEntryRepository subscriptionEntryRepository, final PatchService patchService) {
        this.resourceAssemblers = resourceAssemblers;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.patchService = patchService;
    }

    @RequestMapping(method = GET)
    public SequencedResources<SubscriptionEntryGetResponse> get(@RequestParam(value = "q", required = false) String q,
                                                                @RequestParam(value = "feedUuidEqual", required = false) String feedUuidEqual,
                                                                @RequestParam(value = "seenEqual", required = false) String seenEqual,
                                                                @RequestParam(value = "feedTagEqual", required = false) String feedTagEqual,
                                                                @RequestParam(value = "entryTagEqual", required = false) String entryTagEqual,
                                                                Sequenceable sequenceable,
                                                                @AuthenticationPrincipal MyReaderUser user) {

        Slice<SubscriptionEntry> pagedEntries = subscriptionEntryRepository.findBy(q, user.getId(), feedUuidEqual, feedTagEqual, entryTagEqual, seenEqual, sequenceable.getNext(), sequenceable.toPageable());
        return resourceAssemblers.toResource(toSequence(sequenceable, pagedEntries.getContent()), SubscriptionEntryGetResponse.class);
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

    private static <T extends Identifiable> Sequence<T> toSequence(final Sequenceable sequenceable, final List<T> content) {
        Assert.notNull(content, "Content must not be null!");
        Assert.notNull(sequenceable, "Sliceable must not be null!");
        boolean hasNext = content.size() == sequenceable.getPageSize() + 1;

        if(!hasNext) {
            return new SequenceImpl<>(content);
        }

        Identifiable last = content.get(content.size() - 1);
        List<T> withoutLast = content.subList(0, content.size() - 1);

        Sequenceable request = new SequenceRequest(sequenceable.getPageSize(), last.getId());
        return new SequenceImpl<>(withoutLast, request);
    }

}
