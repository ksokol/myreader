package myreader.resource.user.assembler;

import org.springframework.stereotype.Component;

import myreader.entity.User;
import myreader.resource.user.beans.UserGetResponse;
import spring.hateoas.AbstractResourceAssembler;

/**
 * @author Kamill Sokol
 */
@Component
public class UserGetResponseAssembler extends AbstractResourceAssembler<User,UserGetResponse> {

    public UserGetResponseAssembler() {
        super(User.class, UserGetResponse.class);
    }

    @Override
    public UserGetResponse toResource(User source) {
        UserGetResponse target = new UserGetResponse();

        target.setUuid(String.valueOf(source.getId()));
        target.setEmail(source.getEmail());
        target.setRole(source.getRole());

        return target;
    }

}
