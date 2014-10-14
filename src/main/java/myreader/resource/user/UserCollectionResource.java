package myreader.resource.user;

import myreader.entity.User;
import myreader.repository.UserRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.subscription.SubscriptionCollectionResource;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.user.beans.UserGetResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedResources;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import spring.hateoas.ResourceAssemblers;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value= "/users")
public class UserCollectionResource {

    private final UserRepository userRepository;
    private final SubscriptionCollectionResource subscriptionCollectionResource;
    private ResourceAssemblers resourceAssemblers;

    @Autowired
    public UserCollectionResource(UserRepository userRepository, SubscriptionCollectionResource subscriptionCollectionResource, ResourceAssemblers resourceAssemblers) {
        this.userRepository = userRepository;
        this.subscriptionCollectionResource = subscriptionCollectionResource;
        this.resourceAssemblers = resourceAssemblers;
    }

    @RequestMapping("")
    public PagedResources<UserGetResponse> get(@AuthenticationPrincipal MyReaderUser user, Pageable pageable) {
        Page<User> page;

        if(user.isAdmin()) {
            page = userRepository.findAll(pageable);
        } else {
            page = userRepository.findById(user.getId(), pageable);
        }

        return resourceAssemblers.toPagedResource(page, UserGetResponse.class);
    }

    @RequestMapping("/{id}/subscriptions")
    public PagedResources<SubscriptionGetResponse> userSubscriptions(@PathVariable("id") Long id, Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        if(user.getId().compareTo(id) != 0) {
            throw new ResourceNotFoundException();
        }
        return subscriptionCollectionResource.get(pageable, user);
    }
}
