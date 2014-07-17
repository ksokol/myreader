package myreader.resource.subscriptiontaggroup;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.entity.TagGroup;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import spring.data.ResourceAssemblers;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptiontaggroup.beans.SubscriptionTagGroupGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedResources;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "/subscriptionTagGroups")
public class SubscriptionTagGroupCollectionResource {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final ResourceAssemblers resourceAssemblers;

    @Autowired
    public SubscriptionTagGroupCollectionResource(SubscriptionRepository subscriptionRepository, SubscriptionEntryRepository subscriptionEntryRepository, ResourceAssemblers resourceAssemblers) {
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
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
    public PagedResources<Page<SubscriptionEntryGetResponse>> getSubscriptionEntriesByTag(@PathVariable("id") String tagGroup, Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Page<SubscriptionEntry> subscriptionEtriesPage = subscriptionEntryRepository.findBySubscriptionTagAndUser(tagGroup, user.getId(), pageable);
        return resourceAssemblers.toPagedResource(subscriptionEtriesPage, SubscriptionEntryGetResponse.class);
    }
}
