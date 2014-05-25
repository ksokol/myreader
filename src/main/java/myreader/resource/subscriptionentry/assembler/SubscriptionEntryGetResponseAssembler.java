package myreader.resource.subscriptionentry.assembler;

import myreader.entity.SubscriptionEntry;
import myreader.resource.subscription.SubscriptionEntityResource;
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

        target.setTag(source.getTag());
        target.setCreatedAt(source.getCreatedAt());

        if(source.getFeedEntry() != null) {
            target.setTitle(source.getFeedEntry().getTitle());
            target.setContent(source.getFeedEntry().getContent());
        }

        if(source.getSubscription() != null) {
            target.setFeedTitle(source.getSubscription().getTitle());
        }

        addLinks(source, target);
        return target;
    }

    private void addLinks(SubscriptionEntry source, SubscriptionEntryGetResponse target) {
        Link self = linkTo(SubscriptionEntryResource.class).slash(source.getId()).withSelfRel();
        target.add(self);

		if(source.getSubscription() != null) {
			Link subscription = linkTo(SubscriptionEntityResource.class).slash(source.getSubscription().getId()).withRel("subscription");
			target.add(subscription);
		}

		if(source.getFeedEntry() != null) {
			target.add(new Link(source.getFeedEntry().getUrl(), "origin"));
		}
    }
}
