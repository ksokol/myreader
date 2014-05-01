package myreader.resource.user;

import myreader.entity.User;
import myreader.repository.UserRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.subscription.SubscriptionCollectionResource;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.user.assembler.UserGetResponseAssembler;
import myreader.resource.user.beans.UserGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@Controller
@RequestMapping(value= "/users", produces= MediaType.APPLICATION_JSON_VALUE)
public class UserCollectionResource {

    private final UserGetResponseAssembler preAssembler = new UserGetResponseAssembler(UserCollectionResource.class);
    private final UserRepository userRepository;
    private final PagedResourcesAssembler pagedResourcesAssembler;
    private final SubscriptionCollectionResource subscriptionCollectionResource;

    @Autowired
    public UserCollectionResource(UserRepository userRepository, PagedResourcesAssembler pagedResourcesAssembler, SubscriptionCollectionResource subscriptionCollectionResource) {
        this.userRepository = userRepository;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
        this.subscriptionCollectionResource = subscriptionCollectionResource;
    }

    @ResponseBody
    @RequestMapping("")
    public PagedResources<Page<UserGetResponse>> get(@AuthenticationPrincipal MyReaderUser user, Pageable pageable) {
        Page<User> page;

        if(user.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            page = userRepository.findAll(pageable);
        } else {
            page = userRepository.findById(user.getId(), pageable);
        }

        return pagedResourcesAssembler.toResource(page, preAssembler);
    }

    @ResponseBody
    @RequestMapping("/{id}/subscriptions")
    public PagedResources<Page<SubscriptionGetResponse>> userSubscriptions(@PathVariable("id") Long id, Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        if(user.getId().compareTo(id) != 0) {
            throw new ResourceNotFoundException();
        }
        return subscriptionCollectionResource.get(pageable, user);
    }
}
