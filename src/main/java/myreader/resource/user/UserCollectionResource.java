package myreader.resource.user;

import myreader.entity.User;
import myreader.repository.UserRepository;
import myreader.resource.user.assembler.UserGetResponseAssembler;
import myreader.resource.user.beans.UserGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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

import java.util.Collections;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@Controller
@RequestMapping(value= "/users", produces= MediaType.APPLICATION_JSON_VALUE)
public class UserCollectionResource {

    private final UserGetResponseAssembler preAssembler = new UserGetResponseAssembler(UserCollectionResource.class, UserGetResponse.class);
    private final UserRepository userRepository;
    private final PagedResourcesAssembler pagedResourcesAssembler;

    @Autowired
    public UserCollectionResource(UserRepository userRepository, PagedResourcesAssembler pagedResourcesAssembler) {
        this.userRepository = userRepository;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    @ResponseBody
    @RequestMapping("")
    public PagedResources<Page<UserGetResponse>> get(@AuthenticationPrincipal MyReaderUser user, Pageable pageable) {
        Page<User> page = new PageImpl<User>(Collections.<User>emptyList(), pageable, 0);

        if(user.getAuthorities() == null) {
            //do nothing
        } else if(user.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            page = userRepository.findAll(pageable);
        } else if (user.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_USER"))) {
            page = userRepository.findById(user.getId(), pageable);
        }

        return pagedResourcesAssembler.toResource(page, preAssembler);
    }

    @RequestMapping("/{id}/subscriptions")
    public Object test(@PathVariable("id") Long id) {
        //TODO
        return null;
    }
}
