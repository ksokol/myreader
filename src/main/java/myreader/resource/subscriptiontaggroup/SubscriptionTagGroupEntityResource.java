package myreader.resource.subscriptiontaggroup;

import myreader.entity.TagGroup;
import myreader.repository.SubscriptionRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.subscriptiontaggroup.beans.SubscriptionTagGroupGetResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
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
public class SubscriptionTagGroupEntityResource {

    private final SubscriptionRepository subscriptionRepository;
    private final ResourceAssemblers resourceAssemblers;

    @Autowired
    public SubscriptionTagGroupEntityResource(SubscriptionRepository subscriptionRepository, ResourceAssemblers resourceAssemblers) {
        this.subscriptionRepository = subscriptionRepository;
        this.resourceAssemblers = resourceAssemblers;
    }

    @ModelAttribute
    TagGroup find(@PathVariable("id") String id, @AuthenticationPrincipal MyReaderUser user) {
        TagGroup tagGroup = subscriptionRepository.findTagGroupByTagAndUser(id, user.getId());
        if(tagGroup == null) {
            throw new ResourceNotFoundException();
        }
        return tagGroup;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public SubscriptionTagGroupGetResponse get(@PathVariable("id") String tag, TagGroup tagGroup) {
        return resourceAssemblers.toResource(tagGroup, SubscriptionTagGroupGetResponse.class);
    }
}
