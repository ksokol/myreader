package myreader.resource.subscriptionentry;

import static myreader.Constants.ID;
import static myreader.Constants.SEARCH_PARAM;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static spring.data.domain.SequenceUtil.toSequence;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.service.search.SubscriptionEntrySearchRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import spring.data.domain.Sequenceable;
import spring.hateoas.ResourceAssemblers;
import spring.hateoas.SequencedResources;
import spring.hateoas.SlicedResources;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "/subscriptionEntries", method = GET)
public class SubscriptionEntryCollectionResource {

    private final SubscriptionEntryRepository subscriptionEntryRepository;
	private final SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;
    private final ResourceAssemblers resourceAssemblers;

    @Autowired
    public SubscriptionEntryCollectionResource(SubscriptionEntryRepository subscriptionEntryRepository, SubscriptionEntrySearchRepository subscriptionEntrySearchRepository, ResourceAssemblers resourceAssemblers) {
		this.subscriptionEntryRepository = subscriptionEntryRepository;
		this.subscriptionEntrySearchRepository = subscriptionEntrySearchRepository;
        this.resourceAssemblers = resourceAssemblers;
    }

    @RequestMapping
    public SequencedResources<SubscriptionEntryGetResponse> get(Sequenceable sequenceable, @AuthenticationPrincipal MyReaderUser user) {
        Slice<SubscriptionEntry> pagedEntries = subscriptionEntryRepository.findAllByUser(sequenceable.toPageable(), user.getId(), sequenceable.getNext());
        return resourceAssemblers.toResource(toSequence(sequenceable, pagedEntries.getContent()), SubscriptionEntryGetResponse.class);
    }

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
    public SlicedResources<SubscriptionEntryGetResponse> searchOverTag(@RequestParam(SEARCH_PARAM) String q, Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Slice<SearchableSubscriptionEntry> slice = subscriptionEntrySearchRepository.searchAllTagsAndUser(q, user.getId(), pageable);
        return resourceAssemblers.toResource(slice, SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(value = "tag/{" + ID +"}")
    public SlicedResources<SubscriptionEntryGetResponse> getByTag(@PathVariable(ID) String id, Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Slice<SearchableSubscriptionEntry> slice = subscriptionEntrySearchRepository.findByTagAndUser(id, user.getId(), pageable);
        return resourceAssemblers.toResource(slice, SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(value = "tag/{" + ID + "}", params = SEARCH_PARAM)
    public SlicedResources<SubscriptionEntryGetResponse> searchByTag(@PathVariable(ID) String id, @RequestParam(SEARCH_PARAM) String q, Pageable pageable,
                                                                @AuthenticationPrincipal MyReaderUser user) {
        Slice<SearchableSubscriptionEntry> slice = subscriptionEntrySearchRepository.searchByTagAndUser(q, id, user.getId(), pageable);
        return resourceAssemblers.toResource(slice, SubscriptionEntryGetResponse.class);
    }

}
