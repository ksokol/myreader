package myreader.resource.user;

import myreader.repository.UserRepository;
import myreader.resource.user.beans.UserGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedResources;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import spring.hateoas.ResourceAssemblers;

import java.util.Collection;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value= "api/2/users")
public class UserCollectionResource {

    private final UserRepository userRepository;
    private final ResourceAssemblers resourceAssemblers;

    @Autowired
    public UserCollectionResource(UserRepository userRepository, ResourceAssemblers resourceAssemblers) {
        this.userRepository = userRepository;
        this.resourceAssemblers = resourceAssemblers;
    }

    @RequestMapping("")
    public PagedResources<UserGetResponse> get(@AuthenticationPrincipal User user, Pageable pageable) {
        Page<myreader.entity.User> page;

        if(isAdmin(user)) {
            page = userRepository.findAll(pageable);
        } else {
            page = userRepository.findByEmail(user.getUsername(), pageable);
        }

        return resourceAssemblers.toResource(page, UserGetResponse.class);
    }

    private boolean isAdmin(User user) {
        Collection<GrantedAuthority> authorities = user.getAuthorities();
        SimpleGrantedAuthority adminRole = new SimpleGrantedAuthority("ROLE_ADMIN");

        for (GrantedAuthority authority : authorities) {
            if(authority.equals(adminRole)) {
                return true;
            }
        }
        return false;
    }

}
