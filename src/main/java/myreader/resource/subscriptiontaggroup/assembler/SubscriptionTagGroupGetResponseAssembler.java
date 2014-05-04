package myreader.resource.subscriptiontaggroup.assembler;

import myreader.entity.TagGroup;
import myreader.resource.subscription.SubscriptionCollectionResource;
import myreader.resource.subscriptiontaggroup.SubscriptionTagGroupEntityResource;
import myreader.resource.subscriptiontaggroup.beans.SubscriptionTagGroupGetResponse;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * @author Kamill Sokol
 */
public class SubscriptionTagGroupGetResponseAssembler extends ResourceAssemblerSupport<TagGroup, SubscriptionTagGroupGetResponse> {

    public SubscriptionTagGroupGetResponseAssembler(Class<?> controllerClass) {
        super(controllerClass, SubscriptionTagGroupGetResponse.class);
    }

    @Override
    public SubscriptionTagGroupGetResponse toResource(TagGroup source) {
        SubscriptionTagGroupGetResponse target = new SubscriptionTagGroupGetResponse();
        target.setUnseen(source.getUnseen());
        target.setTag(source.getTag());

        Link self = linkTo(methodOn(SubscriptionTagGroupEntityResource.class).get(source.getTag(), null)).withSelfRel();
        Link subscriptions = linkTo(methodOn(SubscriptionCollectionResource.class).tagGroup(source.getTag(), null, null)).withRel("subscriptions");

        target.add(self);
        target.add(subscriptions);

        return target;
    }
}
