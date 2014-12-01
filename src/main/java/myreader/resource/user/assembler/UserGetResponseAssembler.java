package myreader.resource.user.assembler;

import myreader.entity.User;
import myreader.resource.user.beans.UserGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;
import spring.hateoas.AbstractResourceAssembler;
import spring.hateoas.EntityLinks;

/**
 * @author Kamill Sokol
 */
@Component
public class UserGetResponseAssembler extends AbstractResourceAssembler<User,UserGetResponse> {

    private final EntityLinks entityLinks;

    @Autowired
    public UserGetResponseAssembler(EntityLinks entityLinks) {
        super(User.class, UserGetResponse.class);
        this.entityLinks = entityLinks;
    }

    @Override
    public UserGetResponse toResource(User source) {
        UserGetResponse target = new UserGetResponse();

        target.setUuid(String.valueOf(source.getId()));
        target.setEmail(source.getEmail());
        target.setRole(source.getRole());

        if(source.getSubscriptions() != null) {
            Link subscriptions = entityLinks.linkFor(getOutputClass(), source.getId()).slash("subscriptions").withRel("subscriptions");
            target.add(subscriptions);
        }

        Link self = entityLinks.linkToSingleResource(getOutputClass(), source.getId());
        target.add(self);

        return target;
    }

}
