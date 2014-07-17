package myreader.resource.subscriptionentry;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import spring.data.ResourceAssemblers;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.service.search.SubscriptionEntrySearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedResources;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "/subscriptionEntries")
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

    @RequestMapping(value = "", method = RequestMethod.GET)
    public PagedResources<Page<SubscriptionEntryGetResponse>> get(Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Page<SubscriptionEntry> pagedEntries = subscriptionEntryRepository.findAllByUser(pageable, user.getId());
        return resourceAssemblers.toPagedResource(pagedEntries, SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(value = "search/findBySubscription/{id}", method = RequestMethod.GET)
    public PagedResources<Page<SubscriptionEntryGetResponse>> findBySubscription(@PathVariable("id") Long id, Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Page<SubscriptionEntry> page = subscriptionEntryRepository.findBySubscriptionAndUser(user.getId(), id, pageable);
        return resourceAssemblers.toPagedResource(page, SubscriptionEntryGetResponse.class);
    }

	@RequestMapping(value = "", params = "q", method = RequestMethod.GET)
	public PagedResources<Page<SubscriptionEntryGetResponse>> searchAndFilterBySubscription(@RequestParam("q") String q, Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
		Page<SearchableSubscriptionEntry> page = subscriptionEntrySearchRepository.searchAndFilterByUser(q, user.getId(), pageable);
        return resourceAssemblers.toPagedResource(page, SubscriptionEntryGetResponse.class);
	}

}
