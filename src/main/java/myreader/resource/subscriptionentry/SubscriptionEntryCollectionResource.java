package myreader.resource.subscriptionentry;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.RestControllerSupport;
import myreader.resource.service.patch.PatchService;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryBatchPatchRequest;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;
import myreader.service.search.SubscriptionEntrySearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.hateoas.Resources;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import spring.data.domain.Sequenceable;
import spring.hateoas.ResourceAssemblers;
import spring.hateoas.SequencedResources;
import spring.security.MyReaderUser;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

import static myreader.Constants.ID;
import static myreader.Constants.SEARCH_PARAM;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.PATCH;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "/subscriptionEntries")
public class SubscriptionEntryCollectionResource extends RestControllerSupport {

    private final SubscriptionEntryRepository subscriptionEntryRepository;
	private final SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;
    private final PatchService patchService;

    @Autowired
    public SubscriptionEntryCollectionResource(SubscriptionEntryRepository subscriptionEntryRepository, SubscriptionEntrySearchRepository subscriptionEntrySearchRepository, final PatchService patchService, ResourceAssemblers resourceAssemblers) {
        super(resourceAssemblers);
        this.subscriptionEntryRepository = subscriptionEntryRepository;
		this.subscriptionEntrySearchRepository = subscriptionEntrySearchRepository;
        this.patchService = patchService;
    }

    @RequestMapping(method = GET)
    public SequencedResources<SubscriptionEntryGetResponse> get(Sequenceable sequenceable, @AuthenticationPrincipal MyReaderUser user) {
        Slice<SubscriptionEntry> pagedEntries = subscriptionEntryRepository.findAllByUser(sequenceable.toPageable(), user.getId(), sequenceable.getNext());
        return resourceAssemblers.toResource(toSequence(sequenceable, pagedEntries.getContent()), SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(method = PATCH)
    public Resources<SubscriptionEntryGetResponse> patch(@Valid @RequestBody SubscriptionEntryBatchPatchRequest request, @AuthenticationPrincipal MyReaderUser user) {
        List<SubscriptionEntryGetResponse> subscriptionEntryGetResponses = new ArrayList<>();

        for (final SubscriptionEntryPatchRequest subscriptionPatch : request.getContent()) {
            SubscriptionEntry subscriptionEntry = subscriptionEntryRepository.findByIdAndUsername(Long.valueOf(subscriptionPatch.getUuid()), user.getUsername());
            if(subscriptionEntry == null) {
                continue;
            }
            SubscriptionEntry patched = patchService.patch(subscriptionPatch, subscriptionEntry);
            SubscriptionEntry saved = subscriptionEntryRepository.save(patched);
            SubscriptionEntryGetResponse subscriptionEntryGetResponse = resourceAssemblers.toResource(saved, SubscriptionEntryGetResponse.class);
            subscriptionEntryGetResponses.add(subscriptionEntryGetResponse);
        }

        return new Resources<>(subscriptionEntryGetResponses);
    }

	@RequestMapping(method = GET, params = SEARCH_PARAM)
	public SequencedResources<SubscriptionEntryGetResponse> searchAndFilterBySubscription(@RequestParam(SEARCH_PARAM) String q, Sequenceable sequenceable,
                                                                                       @AuthenticationPrincipal MyReaderUser user) {
		Slice<SearchableSubscriptionEntry> slice = subscriptionEntrySearchRepository.searchAndFilterByUser(q, user.getId(), sequenceable.getNext(), sequenceable.toPageable());
        return resourceAssemblers.toResource(toSequence(sequenceable, slice.getContent()), SubscriptionEntryGetResponse.class);
	}

    @RequestMapping(value = "tag", method = GET)
    public SequencedResources<SubscriptionEntryGetResponse> getTags(Sequenceable sequenceable, @AuthenticationPrincipal MyReaderUser user) {
        Slice<SearchableSubscriptionEntry> slice = subscriptionEntrySearchRepository.findAllTagsAndUser(user.getId(), sequenceable.getNext() ,sequenceable.toPageable());
        return resourceAssemblers.toResource(toSequence(sequenceable, slice.getContent()), SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(value = "tag", method = GET, params = SEARCH_PARAM)
    public SequencedResources<SubscriptionEntryGetResponse> searchOverTag(@RequestParam(SEARCH_PARAM) String q, Sequenceable sequenceable, @AuthenticationPrincipal MyReaderUser user) {
        Slice<SearchableSubscriptionEntry> slice = subscriptionEntrySearchRepository.searchAllTagsAndUser(q, user.getId(), sequenceable.getNext(), sequenceable.toPageable());
        return resourceAssemblers.toResource(toSequence(sequenceable, slice.getContent()), SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(value = "tag/{" + ID +"}", method = GET)
    public SequencedResources<SubscriptionEntryGetResponse> getByTag(@PathVariable(ID) String id, Sequenceable sequenceable, @AuthenticationPrincipal MyReaderUser user) {
        Slice<SearchableSubscriptionEntry> slice = subscriptionEntrySearchRepository.findByTagAndUser(id, user.getId(), sequenceable.getNext(), sequenceable.toPageable());
        return resourceAssemblers.toResource(toSequence(sequenceable, slice.getContent()), SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(value = "tag/{" + ID + "}", method = GET, params = SEARCH_PARAM)
    public SequencedResources<SubscriptionEntryGetResponse> searchByTag(@PathVariable(ID) String id, @RequestParam(SEARCH_PARAM) String q, Sequenceable sequenceable,
                                                                @AuthenticationPrincipal MyReaderUser user) {
        Slice<SearchableSubscriptionEntry> slice = subscriptionEntrySearchRepository.searchByTagAndUser(q, id, user.getId(), sequenceable.getNext(), sequenceable.toPageable());
        return resourceAssemblers.toResource(toSequence(sequenceable, slice.getContent()), SubscriptionEntryGetResponse.class);
    }

}
