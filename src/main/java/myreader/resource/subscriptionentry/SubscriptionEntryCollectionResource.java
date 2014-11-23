package myreader.resource.subscriptionentry;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.service.patch.PatchService;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.service.search.SubscriptionEntrySearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import spring.data.domain.Sequenceable;
import spring.hateoas.ResourceAssemblers;
import spring.hateoas.SequencedResources;
import spring.security.MyReaderUser;

import static myreader.Constants.ID;
import static myreader.Constants.SEARCH_PARAM;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static spring.data.domain.SequenceUtil.toSequence;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "/subscriptionEntries", method = GET)
public class SubscriptionEntryCollectionResource {

    private final SubscriptionEntryRepository subscriptionEntryRepository;
	private final SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;
    private final PatchService patchService;
    private final ResourceAssemblers resourceAssemblers;

    @Autowired
    public SubscriptionEntryCollectionResource(SubscriptionEntryRepository subscriptionEntryRepository, SubscriptionEntrySearchRepository subscriptionEntrySearchRepository, final PatchService patchService, ResourceAssemblers resourceAssemblers) {
		this.subscriptionEntryRepository = subscriptionEntryRepository;
		this.subscriptionEntrySearchRepository = subscriptionEntrySearchRepository;
        this.patchService = patchService;
        this.resourceAssemblers = resourceAssemblers;
    }

    @RequestMapping
    public SequencedResources<SubscriptionEntryGetResponse> get(Sequenceable sequenceable, @AuthenticationPrincipal MyReaderUser user) {
        Slice<SubscriptionEntry> pagedEntries = subscriptionEntryRepository.findAllByUser(sequenceable.toPageable(), user.getId(), sequenceable.getNext());
        return resourceAssemblers.toResource(toSequence(sequenceable, pagedEntries.getContent()), SubscriptionEntryGetResponse.class);
    }

//    @RequestMapping(method = PATCH)
//    public SequencedResources<SubscriptionEntryGetResponse> patch(List<SubscriptionPatchRequest> request, @AuthenticationPrincipal MyReaderUser user) {
//
//        List<SubscriptionEntryGetResponse> objects = new ArrayList<>();
//
//        for (final SubscriptionPatchRequest subscriptionPatch : request) {
//            SubscriptionEntry byIdAndUsername = subscriptionEntryRepository.findByIdAndUsername(id, user.getUsername());
//
//            if(byIdAndUsername == null) {
//                continue;
//            }
//
//            SubscriptionEntry patched = patchService.patch(subscriptionPatch, byIdAndUsername);
//            SubscriptionEntry saved = subscriptionEntryRepository.save(patched);
//           // SubscriptionEntryGetResponse subscriptionEntryGetResponse = resourceAssemblers.toResource(saved, SubscriptionEntryGetResponse.class);
//
//            //  return resourceAssemblers.toResource(saved, SubscriptionEntryGetResponse.class);
//        }
//
//        return null;
//
//        //Slice<SubscriptionEntry> pagedEntries = subscriptionEntryRepository.findAllByUser(sequenceable.toPageable(), user.getId(), sequenceable.getNext());
//       // return resourceAssemblers.toResource(toSequence(sequenceable, pagedEntries.getContent()), SubscriptionEntryGetResponse.class);
//    }

	@RequestMapping(params = SEARCH_PARAM)
	public SequencedResources<SubscriptionEntryGetResponse> searchAndFilterBySubscription(@RequestParam(SEARCH_PARAM) String q, Sequenceable sequenceable,
                                                                                       @AuthenticationPrincipal MyReaderUser user) {
		Slice<SearchableSubscriptionEntry> slice = subscriptionEntrySearchRepository.searchAndFilterByUser(q, user.getId(), sequenceable.getNext(), sequenceable.toPageable());
        return resourceAssemblers.toResource(toSequence(sequenceable, slice.getContent()), SubscriptionEntryGetResponse.class);
	}

    @RequestMapping(value = "tag")
    public SequencedResources<SubscriptionEntryGetResponse> getTags(Sequenceable sequenceable, @AuthenticationPrincipal MyReaderUser user) {
        Slice<SearchableSubscriptionEntry> slice = subscriptionEntrySearchRepository.findAllTagsAndUser(user.getId(), sequenceable.getNext() ,sequenceable.toPageable());
        return resourceAssemblers.toResource(toSequence(sequenceable, slice.getContent()), SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(value = "tag", params = SEARCH_PARAM)
    public SequencedResources<SubscriptionEntryGetResponse> searchOverTag(@RequestParam(SEARCH_PARAM) String q, Sequenceable sequenceable, @AuthenticationPrincipal MyReaderUser user) {
        Slice<SearchableSubscriptionEntry> slice = subscriptionEntrySearchRepository.searchAllTagsAndUser(q, user.getId(), sequenceable.getNext(), sequenceable.toPageable());
        return resourceAssemblers.toResource(toSequence(sequenceable, slice.getContent()), SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(value = "tag/{" + ID +"}")
    public SequencedResources<SubscriptionEntryGetResponse> getByTag(@PathVariable(ID) String id, Sequenceable sequenceable, @AuthenticationPrincipal MyReaderUser user) {
        Slice<SearchableSubscriptionEntry> slice = subscriptionEntrySearchRepository.findByTagAndUser(id, user.getId(), sequenceable.getNext(), sequenceable.toPageable());
        return resourceAssemblers.toResource(toSequence(sequenceable, slice.getContent()), SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(value = "tag/{" + ID + "}", params = SEARCH_PARAM)
    public SequencedResources<SubscriptionEntryGetResponse> searchByTag(@PathVariable(ID) String id, @RequestParam(SEARCH_PARAM) String q, Sequenceable sequenceable,
                                                                @AuthenticationPrincipal MyReaderUser user) {
        Slice<SearchableSubscriptionEntry> slice = subscriptionEntrySearchRepository.searchByTagAndUser(q, id, user.getId(), sequenceable.getNext(), sequenceable.toPageable());
        return resourceAssemblers.toResource(toSequence(sequenceable, slice.getContent()), SubscriptionEntryGetResponse.class);
    }

}
