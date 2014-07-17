package myreader.resource.user;

import myreader.entity.User;
import myreader.repository.UserRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.user.beans.UserGetResponse;
import myreader.resource.user.beans.UserPatchRequest;
import myreader.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import spring.data.ResourceAssemblers;
import spring.security.MyReaderUser;

import javax.validation.Valid;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value= "/users")
public class UserEntityResource {

    private final UserService userService;
    private final UserRepository userRepository;
    private final ResourceAssemblers resourceAssemblers;

    @Autowired
    public UserEntityResource(UserService userService, UserRepository userRepository, ResourceAssemblers resourceAssemblers) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.resourceAssemblers = resourceAssemblers;
    }

    @ModelAttribute
    User find(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user) {
        if(id.compareTo(user.getId()) != 0) {
            //don't differentiate between not found and access denied
            throw new ResourceNotFoundException();
        }
        return userRepository.findOne(user.getId());
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public UserGetResponse get(@PathVariable("id") Long id, User user) {
        return resourceAssemblers.toResource(user, UserGetResponse.class);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PATCH)
    public UserGetResponse patch(@PathVariable("id") Long id, @Valid @RequestBody UserPatchRequest request, User user) {
        if(request.isFieldPatched("password")) {
            userService.setPassword(user, request.getPassword());
        }
        return get(id, user);
    }

}
