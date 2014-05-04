package myreader.resource.subscription.assembler;

import myreader.entity.Subscription;
import myreader.resource.subscription.SubscriptionCollectionResource;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * @author Kamill Sokol
 */
public class SubscriptionGetResponseAssembler extends ResourceAssemblerSupport<Subscription, SubscriptionGetResponse> {

    public SubscriptionGetResponseAssembler(Class<?> controllerClass) {
        super(controllerClass, SubscriptionGetResponse.class);
    }

    @Override
    public SubscriptionGetResponse toResource(Subscription source) {
        SubscriptionGetResponse target = new SubscriptionGetResponse();

        target.setId(source.getId());
        target.setTag(source.getTag());
        target.setCreatedAt(source.getCreatedAt());
        target.setSum(source.getSum());
        target.setTitle(source.getTitle());
        target.setUnseen(source.getUnseen());
        target.setUrl(source.getFeed().getUrl());

        Link subscriptionEntries = linkTo(methodOn(SubscriptionCollectionResource.class).getSubscriptionEntries(source.getId(), null, null)).withRel("entries");
        Link self = linkTo(SubscriptionCollectionResource.class).slash(source.getId()).withSelfRel();

        target.getLinks().add(self);
        target.getLinks().add(subscriptionEntries);

        return target;
    }
}
