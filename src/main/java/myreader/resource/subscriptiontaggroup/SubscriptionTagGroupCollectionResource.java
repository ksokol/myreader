package myreader.resource.subscriptiontaggroup;

import myreader.entity.TagGroup;
import myreader.repository.SubscriptionRepository;
import myreader.resource.subscriptiontaggroup.beans.SubscriptionTagGroupGetResponse;

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
@RequestMapping(value = "/subscriptionTagGroups")
public class SubscriptionTagGroupCollectionResource {

    private final SubscriptionRepository subscriptionRepository;
    private final ResourceAssemblers resourceAssemblers;

    @Autowired
    public SubscriptionTagGroupCollectionResource(SubscriptionRepository subscriptionRepository, ResourceAssemblers resourceAssemblers) {
        this.subscriptionRepository = subscriptionRepository;
        this.resourceAssemblers = resourceAssemblers;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public PagedResources<SubscriptionTagGroupGetResponse> get(Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Page<TagGroup> tagGroupPage = subscriptionRepository.findByUserGroupByTag(user.getId(), pageable);
        return resourceAssemblers.toResource(tagGroupPage, SubscriptionTagGroupGetResponse.class);
    }
}
