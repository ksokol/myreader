package myreader.resource.subscription.assembler;

import myreader.entity.Subscription;
import myreader.resource.subscription.SubscriptionCollectionResource;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscriptiontaggroup.SubscriptionTagGroupEntityResource;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.util.StringUtils;

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

        target.setTag(source.getTag());
        target.setCreatedAt(source.getCreatedAt());
        target.setSum(source.getSum());
        target.setTitle(source.getTitle());
        target.setUnseen(source.getUnseen());

        Link self = linkTo(SubscriptionCollectionResource.class).slash(source.getId()).withSelfRel();
        target.add(self);

        if(source.getFeed() != null) {
            Link origin = new Link(source.getFeed().getUrl(), "origin");
            target.add(origin);
        }

        Link subscriptionEntries = linkTo(methodOn(SubscriptionCollectionResource.class).getSubscriptionEntries(source.getId(), null, null)).withRel("entries");
        target.add(subscriptionEntries);

        if(StringUtils.hasText(source.getTag())) {
            Link subscriptionTagGroup = linkTo(methodOn(SubscriptionTagGroupEntityResource.class).get(source.getTag(), null)).withRel("subscriptionTagGroup");
            target.add(subscriptionTagGroup);
        }

        return target;
    }
}
