package myreader.resource.subscription;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.service.patch.PatchService;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscription.beans.SubscriptionPatchRequest;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.service.search.SubscriptionEntrySearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import spring.data.domain.Sequenceable;
import spring.hateoas.ResourceAssemblers;
import spring.hateoas.SequencedResources;
import spring.hateoas.SlicedResources;
import spring.security.MyReaderUser;

import static myreader.Constants.SEARCH_PARAM;
import static spring.data.domain.SequenceUtil.toSequence;

/**
 * @author Kamill Sokol
 */
@Transactional
@RestController
@RequestMapping(value = "/subscriptions/{id}")
public class SubscriptionEntityResource {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final PatchService patchService;
    private final ResourceAssemblers resourceAssemblers;

    @Autowired
    public SubscriptionEntityResource(SubscriptionRepository subscriptionService, SubscriptionEntrySearchRepository subscriptionEntrySearchRepository, SubscriptionEntryRepository subscriptionEntryRepository, PatchService patchService, ResourceAssemblers resourceAssemblers) {
        this.subscriptionRepository = subscriptionService;
        this.subscriptionEntrySearchRepository = subscriptionEntrySearchRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.patchService = patchService;
        this.resourceAssemblers = resourceAssemblers;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public SubscriptionGetResponse get(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user) {
        Subscription subscription = findOrThrowException(id, user.getUsername());
        return resourceAssemblers.toResource(subscription, SubscriptionGetResponse.class);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping(value = "", method = RequestMethod.DELETE)
    public void delete(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user) {
        subscriptionRepository.delete(findOrThrowException(id, user.getUsername()));
    }

    @RequestMapping(value = "", method = RequestMethod.PATCH)
    public SubscriptionGetResponse patch(@PathVariable("id") Long id,@RequestBody SubscriptionPatchRequest request, @AuthenticationPrincipal MyReaderUser user) {
        Subscription subscription = findOrThrowException(id, user.getUsername());
        Subscription patchedSubscription = patchService.patch(request, subscription);
        subscriptionRepository.save(patchedSubscription);
        return get(id, user);
    }

    @RequestMapping(value = "/entries/new", method = RequestMethod.GET)
    public SlicedResources<SubscriptionEntryGetResponse> getSubscriptionEntriesNew(@PathVariable("id") Long id, Pageable pageable,
                                                                                   @AuthenticationPrincipal MyReaderUser user ) {
        Slice<SubscriptionEntry> slice = subscriptionEntryRepository.findNewBySubscriptionAndUser(user.getId(), id, pageable);
        return resourceAssemblers.toResource(slice, SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(value = "/entries/new", params = SEARCH_PARAM, method = RequestMethod.GET)
    public SequencedResources<SubscriptionEntryGetResponse> searchNewSubscriptionEntries(@RequestParam(SEARCH_PARAM) String q, @PathVariable("id") Long id,
                                                                                      Sequenceable sequenceable, @AuthenticationPrincipal MyReaderUser user ) {
        Slice<SearchableSubscriptionEntry> slice = subscriptionEntrySearchRepository.searchForNewAndFilterByUserAndSubscription(q, id, user.getId(), sequenceable.getNext(), sequenceable.toPageable());
        return resourceAssemblers.toResource(toSequence(sequenceable, slice.getContent()), SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(value = "/entries", method = RequestMethod.GET)
    public SequencedResources<SubscriptionEntryGetResponse> getSubscriptionEntries(@PathVariable("id") Long id, Sequenceable sequenceable,
                                                                                @AuthenticationPrincipal MyReaderUser user ) {
        Slice<SubscriptionEntry> slice = subscriptionEntryRepository.findBySubscriptionAndUser(user.getId(), id, sequenceable.getNext(), sequenceable.toPageable());
        return resourceAssemblers.toResource(toSequence(sequenceable, slice.getContent()), SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(value = "/entries", params = SEARCH_PARAM, method = RequestMethod.GET)
    public SlicedResources<SubscriptionEntryGetResponse> searchAndFilterBySubscription(@RequestParam(SEARCH_PARAM) String q, @PathVariable("id") Long id,
                                                                                      Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Slice<SearchableSubscriptionEntry> slice = subscriptionEntrySearchRepository.searchAndFilterByUserAndSubscription(q, id, user.getId(), pageable);
        return resourceAssemblers.toResource(slice, SubscriptionEntryGetResponse.class);
    }

    public Subscription findOrThrowException(Long id, String username) {
        Subscription subscription = subscriptionRepository.findByIdAndUsername(id, username);
        if(subscription == null) {
            throw new ResourceNotFoundException();
        }
        return subscription;
    }
}
