package myreader.resource.subscriptionentry;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.repository.UserRepository;
import myreader.resource.service.patch.PatchService;
import myreader.resource.subscriptionentry.beans.SearchRequest;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryBatchPatchRequest;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.hateoas.Resources;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

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

    private final ResourceAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> assembler;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final UserRepository userRepository;
    private final PatchService patchService;

    @Autowired
    public SubscriptionEntryCollectionResource(final ResourceAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> assembler,
                                               final SubscriptionRepository subscriptionRepository,
                                               final SubscriptionEntryRepository subscriptionEntryRepository,
                                               final UserRepository userRepository,
                                               final PatchService patchService) {
        this.assembler = assembler;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.userRepository = userRepository;
        this.patchService = patchService;
    }

    @RequestMapping(method = GET)
    public PagedResources<SubscriptionEntryGetResponse> get(SearchRequest page, @AuthenticationPrincipal User user) {
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

        List<SubscriptionEntryGetResponse> list = new ArrayList<>(pagedEntries.getSize());
        for (SubscriptionEntry pagedEntry : pagedEntries) {
            list.add(assembler.toResource(pagedEntry));
        }

        return SequencedResourcesUtils.toSequencedResources(page.getSize(), list);
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
            SubscriptionEntryGetResponse subscriptionEntryGetResponse = assembler.toResource(saved);
            subscriptionEntryGetResponses.add(subscriptionEntryGetResponse);
        }

        return new Resources<>(subscriptionEntryGetResponses);
    }
}
