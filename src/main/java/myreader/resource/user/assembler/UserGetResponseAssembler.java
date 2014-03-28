package myreader.resource.user.assembler;

import myreader.entity.User;
import myreader.resource.user.UserCollectionResource;
import myreader.resource.user.beans.UserGetResponse;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public class UserGetResponseAssembler extends ResourceAssemblerSupport<User, UserGetResponse> {

    public UserGetResponseAssembler(Class<?> controllerClass, Class<UserGetResponse> resourceType) {
        super(controllerClass, resourceType);
    }

    @Override
    public UserGetResponse toResource(User source) {
        UserGetResponse target = new UserGetResponse();

        target.setId(source.getId());
        target.setEmail(source.getEmail());
        target.setRole(source.getRole());

        addLinks(source, target);

        return target;
    }

    private void addLinks(User source, UserGetResponse target) {

        if(source.getSubscriptions() != null) {
            Link subscriptions = linkTo(methodOn(UserCollectionResource.class).test(source.getId())).withRel("subscriptions");
            target.add(subscriptions);
        }

       // Link self = linkTo(SubscriptionEntryResource.class).slash(source.getId()).withSelfRel();
       //  target.add(self);
    }
}
