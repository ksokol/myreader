package myreader.resource.subscriptionentrytaggroup;

import myreader.entity.SubscriptionEntryTagGroup;
import myreader.resource.subscriptionentrytaggroup.beans.SubscriptionEntryTagGroupGetResponse;
import myreader.service.search.SubscriptionEntrySearchRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedResources;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import spring.hateoas.ResourceAssemblers;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "/subscriptionEntryTagGroups", method = RequestMethod.GET)
public class SubscriptionEntryTagGroupCollectionResource {

    private final SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;
    private final ResourceAssemblers resourceAssemblers;

    @Autowired
    public SubscriptionEntryTagGroupCollectionResource(SubscriptionEntrySearchRepository subscriptionEntrySearchRepository, ResourceAssemblers resourceAssemblers) {
        this.subscriptionEntrySearchRepository = subscriptionEntrySearchRepository;
        this.resourceAssemblers = resourceAssemblers;
    }

    @RequestMapping("")
    public PagedResources<SubscriptionEntryTagGroupGetResponse> get(Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Page<SubscriptionEntryTagGroup> page = subscriptionEntrySearchRepository.findDistinctTagsByUser(user.getId(), pageable);
        return resourceAssemblers.toResource(page, SubscriptionEntryTagGroupGetResponse.class);
    }

}
