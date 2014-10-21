package myreader.resource.subscriptionentrytaggroup;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.service.search.SubscriptionEntrySearchRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import spring.hateoas.ResourceAssemblers;
import spring.hateoas.SlicedResources;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "/subscriptionEntryTagGroups/{id}", method = RequestMethod.GET)
public class SubscriptionEntryTagGroupEntityResource {

    private final SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;
    private final ResourceAssemblers resourceAssemblers;

    @Autowired
    public SubscriptionEntryTagGroupEntityResource(SubscriptionEntrySearchRepository subscriptionEntrySearchRepository, ResourceAssemblers resourceAssemblers) {
        this.subscriptionEntrySearchRepository = subscriptionEntrySearchRepository;
        this.resourceAssemblers = resourceAssemblers;
    }

    @RequestMapping("")
    public SlicedResources<SubscriptionEntryGetResponse> get(@PathVariable("id") String id, Pageable pageable,
                                                             @AuthenticationPrincipal MyReaderUser user) {
        Slice<SearchableSubscriptionEntry> slice = subscriptionEntrySearchRepository.findByTagAndUser(id, user.getId(), pageable);
        return resourceAssemblers.toResource(slice, SubscriptionEntryGetResponse.class);
    }

}
