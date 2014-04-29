package myreader.resource.user;

import myreader.entity.User;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.user.assembler.UserGetResponseAssembler;
import myreader.resource.user.beans.UserGetResponse;
import myreader.resource.user.beans.UserPatchRequest;
import myreader.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import spring.security.MyReaderUser;

import javax.validation.Valid;

/**
 * @author Kamill Sokol
 */
@Controller
@RequestMapping(value= "/users", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserEntityResource {

    private final UserGetResponseAssembler assembler = new UserGetResponseAssembler(UserCollectionResource.class);
    private final UserService userService;

    @Autowired
    public UserEntityResource(UserService userService) {
        this.userService = userService;
    }

    @ModelAttribute
    public User find(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user) {
        if(id.compareTo(user.getId()) != 0) {
            //don't differentiate between not found and access denied
            throw new ResourceNotFoundException();
        } else {
            return userService.findOne(user.getId());
        }
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public UserGetResponse get(User user) {
        return assembler.toResource(user);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PATCH, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public UserGetResponse patch(@Valid @RequestBody UserPatchRequest request, User user) {
        if(request.isFieldPatched("password")) {
            userService.setPassword(user, request.getPassword());
        }
        return get(user);
    }

}
