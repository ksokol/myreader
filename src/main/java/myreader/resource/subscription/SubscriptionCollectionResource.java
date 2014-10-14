package myreader.resource.subscription;

import javax.validation.Valid;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.Subscription;
import myreader.repository.SubscriptionRepository;
import myreader.resource.subscription.beans.SubscribePostRequest;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscriptionentry.SubscriptionEntryCollectionResource;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.service.search.SubscriptionEntrySearchRepository;
import myreader.service.subscription.SubscriptionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedResources;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import spring.hateoas.ResourceAssemblers;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "/subscriptions")
public class SubscriptionCollectionResource {

	private final SubscriptionService subscriptionService;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntryCollectionResource subscriptionEntryCollectionResource;
	private final SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;
    private final ResourceAssemblers resourceAssemblers;

    @Autowired
    public SubscriptionCollectionResource(SubscriptionService subscriptionService, SubscriptionRepository subscriptionRepository, SubscriptionEntryCollectionResource subscriptionEntryCollectionResource, SubscriptionEntrySearchRepository subscriptionEntrySearchRepository, ResourceAssemblers resourceAssemblers) {
        this.subscriptionService = subscriptionService;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryCollectionResource = subscriptionEntryCollectionResource;
		this.subscriptionEntrySearchRepository = subscriptionEntrySearchRepository;
        this.resourceAssemblers = resourceAssemblers;
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public SubscriptionGetResponse post(@Valid @RequestBody SubscribePostRequest request, @AuthenticationPrincipal MyReaderUser user) {
        Subscription subscription = subscriptionService.subscribe(user.getId(), request.getUrl());
        return resourceAssemblers.toResource(subscription, SubscriptionGetResponse.class);
    }

    @RequestMapping(value = "/{id}/entries", method = RequestMethod.GET)
    public PagedResources<SubscriptionEntryGetResponse> getSubscriptionEntries(@PathVariable("id") Long id,  Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        return subscriptionEntryCollectionResource.findBySubscription(id, pageable, user);
    }

    @RequestMapping(value="", method = RequestMethod.GET)
    public PagedResources<SubscriptionGetResponse> get(Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Page<Subscription> subscriptionPage = subscriptionRepository.findAllByUser(user.getId(), pageable);
        return resourceAssemblers.toPagedResource(subscriptionPage, SubscriptionGetResponse.class);
    }

	@RequestMapping(value = "/{id}/entries", params = "q", method = RequestMethod.GET)
	public PagedResources<SubscriptionEntryGetResponse> searchAndFilterBySubscription(@RequestParam("q") String q, @PathVariable("id") Long id, Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
		Page<SearchableSubscriptionEntry> page = subscriptionEntrySearchRepository.searchAndFilterByUserAndSubscription(q, id, user.getId(), pageable);
		return resourceAssemblers.toPagedResource(page, SubscriptionEntryGetResponse.class);
	}
}
