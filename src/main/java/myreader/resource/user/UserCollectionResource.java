package myreader.resource.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedResources;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import myreader.entity.User;
import myreader.repository.UserRepository;
import myreader.resource.RestControllerSupport;
import myreader.resource.subscription.SubscriptionCollectionResource;
import myreader.resource.user.beans.UserGetResponse;
import spring.hateoas.ResourceAssemblers;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value= "/users")
public class UserCollectionResource extends RestControllerSupport {

    private final UserRepository userRepository;
    private final SubscriptionCollectionResource subscriptionCollectionResource;

    @Autowired
    public UserCollectionResource(UserRepository userRepository, SubscriptionCollectionResource subscriptionCollectionResource, ResourceAssemblers resourceAssemblers) {
        super(resourceAssemblers);
        this.userRepository = userRepository;
        this.subscriptionCollectionResource = subscriptionCollectionResource;
    }

    @RequestMapping("")
    public PagedResources<UserGetResponse> get(@AuthenticationPrincipal MyReaderUser user, Pageable pageable) {
        Page<User> page;

        if(user.isAdmin()) {
            page = userRepository.findAll(pageable);
        } else {
            page = userRepository.findById(user.getId(), pageable);
        }

        return resourceAssemblers.toResource(page, UserGetResponse.class);
    }

}
