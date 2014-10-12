package myreader.resource.subscriptiontaggroup;

import java.util.Collections;
import java.util.List;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.entity.TagGroup;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptiontaggroup.beans.SubscriptionTagGroupGetResponse;
import myreader.service.search.SubscriptionEntrySearchRepository;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedResources;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import spring.data.ResourceAssemblers;
import spring.data.TemplateLinkBuilder;
import spring.security.MyReaderUser;

import static myreader.Constants.SEARCH_PARAM;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "/subscriptionTagGroups")
public class SubscriptionTagGroupCollectionResource {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;
    private final ResourceAssemblers resourceAssemblers;

    @Autowired
    public SubscriptionTagGroupCollectionResource(SubscriptionRepository subscriptionRepository, SubscriptionEntryRepository subscriptionEntryRepository, SubscriptionEntrySearchRepository subscriptionEntrySearchRepository, ResourceAssemblers resourceAssemblers) {
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.subscriptionEntrySearchRepository = subscriptionEntrySearchRepository;
        this.resourceAssemblers = resourceAssemblers;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public PagedResources<Page<SubscriptionTagGroupGetResponse>> get(Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Page<TagGroup> tagGroupPage = subscriptionRepository.findByUserGroupByTag(user.getId(), pageable);
        return resourceAssemblers.toPagedResource(tagGroupPage, SubscriptionTagGroupGetResponse.class);
    }

    @RequestMapping(value = "/{id}/subscriptions", method = RequestMethod.GET)
    public PagedResources<Page<SubscriptionGetResponse>> getSubscriptionsByTag(@PathVariable("id") String tagGroup, Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Page<Subscription> subscriptionPage = subscriptionRepository.findByTagAndUser(tagGroup, user.getId(), pageable);
        return resourceAssemblers.toPagedResource(subscriptionPage, SubscriptionGetResponse.class);
    }

    @RequestMapping(value = "/{id}/entries", method = RequestMethod.GET)
    public PagedResources<Page<SubscriptionEntryGetResponse>> getSubscriptionEntriesByTag(@PathVariable("id") String tagGroup, Pageable pageable,
                                                                                          @AuthenticationPrincipal MyReaderUser user,
                                                                                          TemplateLinkBuilder templatedLinkBuilder) {

        Page<SubscriptionEntry> subscriptionEtriesPage = subscriptionEntryRepository.findBySubscriptionTagAndUser(tagGroup, user.getId(), pageable);
        return resourceAssemblers.toPagedResource(subscriptionEtriesPage, SubscriptionEntryGetResponse.class, templatedLinkBuilder.requestParam(SEARCH_PARAM).link());
    }

    @RequestMapping(value = "/{id}/entries", method = RequestMethod.GET, params = SEARCH_PARAM)
    public PagedResources<Page<SubscriptionEntryGetResponse>> findSubscriptionEntriesByTag(@PathVariable("id") String tagGroup,
                                                                                           @RequestParam(SEARCH_PARAM) String q,
                                                                                           Pageable pageable,
                                                                                           @AuthenticationPrincipal MyReaderUser user,
                                                                                           TemplateLinkBuilder templatedLinkBuilder) {
        Link selfLink = templatedLinkBuilder.requestParam(SEARCH_PARAM).link();
        List<Long> subscriptionIds = subscriptionRepository.findByTagAndUser(tagGroup, user.getId());

        if(CollectionUtils.isEmpty(subscriptionIds)) {
            return resourceAssemblers.toPagedResource(new PageImpl(Collections.emptyList(), pageable, 0), SubscriptionEntryGetResponse.class, selfLink);
        }

        Page<SearchableSubscriptionEntry> searchableSubscriptionEntries = subscriptionEntrySearchRepository.searchAndFilterByUserAndSubscriptions(q,
                subscriptionIds, user.getId(), pageable);
        return resourceAssemblers.toPagedResource(searchableSubscriptionEntries, SubscriptionEntryGetResponse.class, selfLink);
    }

}
