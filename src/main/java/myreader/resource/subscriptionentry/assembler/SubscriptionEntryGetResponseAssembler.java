package myreader.resource.subscriptionentry.assembler;

import myreader.entity.SubscriptionEntry;
import myreader.resource.subscription.EntityController;
import myreader.resource.subscriptionentry.SubscriptionEntryResource;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryGetResponseAssembler extends ResourceAssemblerSupport<SubscriptionEntry, SubscriptionEntryGetResponse> {

    public SubscriptionEntryGetResponseAssembler(Class<?> controllerClass) {
        super(controllerClass, SubscriptionEntryGetResponse.class);
    }

    @Override
    public SubscriptionEntryGetResponse toResource(SubscriptionEntry source) {
        SubscriptionEntryGetResponse target = new SubscriptionEntryGetResponse();

        target.setId(source.getId());
        target.setTag(source.getTag());

        if(source.getFeedEntry() != null) {
            target.setTitle(source.getFeedEntry().getTitle());
        }

        addLinks(source, target);
        return target;
    }

    private void addLinks(SubscriptionEntry source, SubscriptionEntryGetResponse target) {
        if(source.getSubscription() != null) {
            Link subscription = linkTo(EntityController.class).slash(source.getSubscription().getId()).withRel("subscription");
            target.add(subscription);
        }

        Link self = linkTo(SubscriptionEntryResource.class).slash(source.getId()).withSelfRel();

        target.add(self);
    }
}
