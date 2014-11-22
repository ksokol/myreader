package myreader.resource.user;

import myreader.entity.User;
import myreader.repository.UserRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.user.beans.UserGetResponse;
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
@RequestMapping(value= "/users")
public class UserEntityResource {

    private final UserRepository userRepository;
    private final ResourceAssemblers resourceAssemblers;

    @Autowired
    public UserEntityResource(UserRepository userRepository, ResourceAssemblers resourceAssemblers) {
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

}
