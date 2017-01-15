package myreader.resource.subscriptionentry;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.repository.UserRepository;
import myreader.resource.service.patch.PatchService;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryBatchPatchRequest;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;
import myreader.resource.subscriptionentry.beans.SearchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.hateoas.Resources;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import spring.data.domain.Sequence;
import spring.data.domain.SequenceImpl;
import spring.hateoas.ResourceAssemblers;
import spring.hateoas.SequencedResources;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "api/2/subscriptionEntries")
public class SubscriptionEntryCollectionResource {

    private final ResourceAssemblers resourceAssemblers;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final UserRepository userRepository;
    private final PatchService patchService;

    @Autowired
    public SubscriptionEntryCollectionResource(final ResourceAssemblers resourceAssemblers, final SubscriptionRepository subscriptionRepository, final SubscriptionEntryRepository subscriptionEntryRepository, UserRepository userRepository, final PatchService patchService) {
        this.resourceAssemblers = resourceAssemblers;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.userRepository = userRepository;
        this.patchService = patchService;
    }

    @RequestMapping(method = GET)
    public SequencedResources<SubscriptionEntryGetResponse> get(SearchRequest page, @AuthenticationPrincipal User user) {
        myreader.entity.User myreaderUser = userRepository.findByEmail(user.getUsername());

        Slice<SubscriptionEntry> pagedEntries = subscriptionEntryRepository.findBy(
                page.getQ(),
                myreaderUser.getId(),
                page.getFeedUuidEqual(),
                page.getFeedTagEqual(),
                page.getEntryTagEqual(),
                page.getSeenEqual(),
                page.getNext(),
                page.getSize()
        );
        return resourceAssemblers.toResource(toSequence(page.getSize(), pagedEntries.getContent()), SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(value = "availableTags", method = GET)
    public Set<String> tags(@AuthenticationPrincipal User user) {
        myreader.entity.User myreaderUser = userRepository.findByEmail(user.getUsername());
        return subscriptionEntryRepository.findDistinctTags(myreaderUser.getId());
    }

    //TODO remove RequestMethod.PUT after Android 2.x phased out
    @Transactional
    @RequestMapping(method = {RequestMethod.PATCH, RequestMethod.PUT})
    public Resources<SubscriptionEntryGetResponse> patch(@Valid @RequestBody SubscriptionEntryBatchPatchRequest request) {
        List<SubscriptionEntryGetResponse> subscriptionEntryGetResponses = new ArrayList<>();

        for (final SubscriptionEntryPatchRequest subscriptionPatch : request.getContent()) {
            SubscriptionEntry subscriptionEntry = subscriptionEntryRepository.findByIdAndCurrentUser(Long.valueOf(subscriptionPatch.getUuid()));
            if (subscriptionEntry == null) {
                continue;
            }

            if (subscriptionPatch.isFieldPatched("seen") && subscriptionPatch.getSeen() != subscriptionEntry.isSeen()) {
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

    private static Sequence<SubscriptionEntry> toSequence(final int pageSize, final List<SubscriptionEntry> content) {
        boolean hasNext = content.size() >= pageSize;

        if (!hasNext) {
            return new SequenceImpl<>(content);
        }

        SubscriptionEntry last = content.get(content.size() -1);
        return new SequenceImpl<>(content, pageSize , last.getId() - 1);
    }
}
