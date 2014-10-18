package myreader.resource.subscriptiontaggroup;

import static myreader.Constants.SEARCH_PARAM;

import java.util.Collections;
import java.util.List;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.service.search.SubscriptionEntrySearchRepository;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.hateoas.PagedResources;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import spring.hateoas.ResourceAssemblers;
import spring.hateoas.SlicedResources;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "/subscriptionTagGroups/{id}")
public class SubscriptionTagGroupEntityResource {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;
    private final ResourceAssemblers resourceAssemblers;

    @Autowired
    public SubscriptionTagGroupEntityResource(SubscriptionRepository subscriptionRepository, SubscriptionEntryRepository subscriptionEntryRepository,
                                              SubscriptionEntrySearchRepository subscriptionEntrySearchRepository, ResourceAssemblers resourceAssemblers) {
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.subscriptionEntrySearchRepository = subscriptionEntrySearchRepository;
        this.resourceAssemblers = resourceAssemblers;
    }

    @RequestMapping(value = "/subscriptions", method = RequestMethod.GET)
    public PagedResources<SubscriptionGetResponse> getSubscriptionsByTag(@PathVariable("id") String tagGroup, Pageable pageable,
                                                                         @AuthenticationPrincipal MyReaderUser user) {
        Page<Subscription> subscriptionPage = subscriptionRepository.findByTagAndUser(tagGroup, user.getId(), pageable);
        return resourceAssemblers.toResource(subscriptionPage, SubscriptionGetResponse.class);
    }

    @RequestMapping(value = "/entries", method = RequestMethod.GET)
    public SlicedResources<SubscriptionEntryGetResponse> getSubscriptionEntriesByTag(@PathVariable("id") String tagGroup, Pageable pageable,
                                                                                     @AuthenticationPrincipal MyReaderUser user) {

        Slice<SubscriptionEntry> slice = subscriptionEntryRepository.findBySubscriptionTagAndUser(tagGroup, user.getId(), pageable);
        return resourceAssemblers.toResource(slice, SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(value = "/entries", method = RequestMethod.GET, params = SEARCH_PARAM)
    public SlicedResources<SubscriptionEntryGetResponse> searchSubscriptionEntriesByTag(@PathVariable("id") String tagGroup,
                                                                                        @RequestParam(SEARCH_PARAM) String q,
                                                                                        Pageable pageable,
                                                                                        @AuthenticationPrincipal MyReaderUser user) {
        List<Long> subscriptionIds = subscriptionRepository.findByTagAndUser(tagGroup, user.getId());

        if(CollectionUtils.isEmpty(subscriptionIds)) {
            return resourceAssemblers.toResource(new SliceImpl<>(Collections.emptyList()), SubscriptionEntryGetResponse.class);
        }

        Slice<SearchableSubscriptionEntry> searchableSubscriptionEntries = subscriptionEntrySearchRepository.searchAndFilterByUserAndSubscriptions(q,
                subscriptionIds, user.getId(), pageable);
        return resourceAssemblers.toResource(searchableSubscriptionEntries, SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(value = "/entries/new", method = RequestMethod.GET)
    public SlicedResources<SubscriptionEntryGetResponse> getNewSubscriptionEntriesByTag(@PathVariable("id") String tagGroup, Pageable pageable,
                                                                                     @AuthenticationPrincipal MyReaderUser user) {
        Slice<SubscriptionEntry> slice = subscriptionEntryRepository.findNewBySubscriptionTagAndUser(user.getId(), tagGroup, pageable);
        return resourceAssemblers.toResource(slice, SubscriptionEntryGetResponse.class);
    }

    @RequestMapping(value = "/entries/new", method = RequestMethod.GET, params = SEARCH_PARAM)
    public SlicedResources<SubscriptionEntryGetResponse> searchNewSubscriptionEntriesByTag(@PathVariable("id") String tagGroup,
                                                                                           @RequestParam(SEARCH_PARAM) String q,
                                                                                           Pageable pageable,
                                                                                           @AuthenticationPrincipal MyReaderUser user) {
        List<Long> subscriptionIds = subscriptionRepository.findByTagAndUser(tagGroup, user.getId());

        if(CollectionUtils.isEmpty(subscriptionIds)) {
            return resourceAssemblers.toResource(new SliceImpl<>(Collections.emptyList()), SubscriptionEntryGetResponse.class);
        }

        Slice<SearchableSubscriptionEntry> searchableSubscriptionEntries = subscriptionEntrySearchRepository.searchNewByAndFilterByUserAndSubscriptions(q,
                subscriptionIds, user.getId(), pageable);
        return resourceAssemblers.toResource(searchableSubscriptionEntries, SubscriptionEntryGetResponse.class);
    }
}
