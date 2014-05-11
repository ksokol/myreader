package myreader.resource.subscriptiontaggroup;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.entity.TagGroup;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.resource.subscription.assembler.SubscriptionGetResponseAssembler;
import myreader.resource.subscriptionentry.assembler.SubscriptionEntryGetResponseAssembler;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptiontaggroup.assembler.SubscriptionTagGroupGetResponseAssembler;
import myreader.resource.subscriptiontaggroup.beans.SubscriptionTagGroupGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.MediaType;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@RequestMapping(value = "/subscriptionTagGroups", produces = MediaType.APPLICATION_JSON_VALUE)
@Controller
public class SubscriptionTagGroupCollectionResource {

    private final SubscriptionTagGroupGetResponseAssembler preAssembler = new SubscriptionTagGroupGetResponseAssembler(SubscriptionTagGroupCollectionResource.class);
    private final SubscriptionGetResponseAssembler subscriptionAssembler = new SubscriptionGetResponseAssembler(SubscriptionTagGroupCollectionResource.class);
    private final SubscriptionEntryGetResponseAssembler subscriptionEntriesAssembler = new SubscriptionEntryGetResponseAssembler(SubscriptionTagGroupCollectionResource.class);
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final PagedResourcesAssembler pagedResourcesAssembler;

    @Autowired
    public SubscriptionTagGroupCollectionResource(SubscriptionRepository subscriptionRepository, SubscriptionEntryRepository subscriptionEntryRepository, PagedResourcesAssembler pagedResourcesAssembler) {
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public PagedResources<Page<SubscriptionTagGroupGetResponse>> get(Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Page<TagGroup> tagGroupPage = subscriptionRepository.findByUserGroupByTag(user.getId(), pageable);
        return pagedResourcesAssembler.toResource(tagGroupPage, preAssembler);
    }

    @RequestMapping(value = "/{id}/subscriptions", method = RequestMethod.GET)
    @ResponseBody
    public PagedResources<Page<SubscriptionTagGroupGetResponse>> getSubscriptionsByTag(@PathVariable("id") String tagGroup, Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Page<Subscription> subscriptionPage = subscriptionRepository.findByTagAndUser(tagGroup, user.getId(), pageable);
        return pagedResourcesAssembler.toResource(subscriptionPage, subscriptionAssembler);
    }

    @RequestMapping(value = "/{id}/entries", method = RequestMethod.GET)
    @ResponseBody
    public PagedResources<Page<SubscriptionEntryGetResponse>> getSubscriptionEntriesByTag(@PathVariable("id") String tagGroup, Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Page<SubscriptionEntry> subscriptionEtriesPage = subscriptionEntryRepository.findBySubscriptionTagAndUser(tagGroup, user.getId(), pageable);


      // Page<Subscription> subscriptionPage = subscriptionRepository.findByTagAndUser(tagGroup, user.getId(), pageable);
        return pagedResourcesAssembler.toResource(subscriptionEtriesPage, subscriptionEntriesAssembler);
    }
}
