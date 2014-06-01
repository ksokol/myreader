package myreader.resource.subscriptionentry;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.subscription.SubscriptionEntityResource;
import myreader.resource.subscriptionentry.assembler.SearchableSubscriptionEntryGetResponseAssembler;
import myreader.resource.subscriptionentry.assembler.SubscriptionEntryGetResponseAssembler;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.service.search.SubscriptionEntrySearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.MediaType;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@Controller
@RequestMapping(value = "/subscriptionEntries", produces = MediaType.APPLICATION_JSON_VALUE)
public class SubscriptionEntryCollectionResource {

	private final SubscriptionEntryGetResponseAssembler subscriptionEntryAssembler = new SubscriptionEntryGetResponseAssembler(SubscriptionEntryCollectionResource.class);
	private final SearchableSubscriptionEntryGetResponseAssembler searchableSubscriptionEntryAssembler = new SearchableSubscriptionEntryGetResponseAssembler(SubscriptionEntityResource.class);

    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final PagedResourcesAssembler pagedResourcesAssembler;
	private final SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;

    @Autowired
    public SubscriptionEntryCollectionResource(SubscriptionEntryRepository subscriptionEntryRepository, PagedResourcesAssembler pagedResourcesAssembler, SubscriptionEntrySearchRepository subscriptionEntrySearchRepository) {
		this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
		this.subscriptionEntrySearchRepository = subscriptionEntrySearchRepository;
	}

    @ResponseBody
    @RequestMapping(value = "", method = RequestMethod.GET)
    public PagedResources<Page<SubscriptionEntry>> get(Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Page<SubscriptionEntry> pagedEntries = subscriptionEntryRepository.findAllByUser(pageable, user.getId());
        return pagedResourcesAssembler.toResource(pagedEntries, subscriptionEntryAssembler);
    }

    @ResponseBody
    @RequestMapping(value = "search/findBySubscription/{id}", method = RequestMethod.GET)
    public PagedResources<Page<SubscriptionEntryGetResponse>> findBySubscription(@PathVariable("id") Long id, Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Page<SubscriptionEntry> page = subscriptionEntryRepository.findBySubscriptionAndUser(user.getId(), id, pageable);
        return pagedResourcesAssembler.toResource(page, subscriptionEntryAssembler);
    }

	@ResponseBody
	@RequestMapping(value = "", params = "q", method = RequestMethod.GET)
	public PagedResources<Page<SubscriptionEntryGetResponse>> searchAndFilterBySubscription(@RequestParam("q") String q, Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
		Page<SearchableSubscriptionEntry> page = subscriptionEntrySearchRepository.searchAndFilterByUser(q, user.getId(), pageable);
		return pagedResourcesAssembler.toResource(page, searchableSubscriptionEntryAssembler);
	}

}
