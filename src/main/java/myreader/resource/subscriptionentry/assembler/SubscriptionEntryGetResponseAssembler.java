package myreader.resource.subscriptionentry.assembler;

import myreader.entity.SubscriptionEntry;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import org.springframework.hateoas.EntityLinks;
import org.springframework.hateoas.Link;
import spring.data.AbstractResourceAssembler;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryGetResponseAssembler extends AbstractResourceAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> {

    private final EntityLinks entityLinks;

    public SubscriptionEntryGetResponseAssembler(EntityLinks entityLinks) {
        super(SubscriptionEntry.class, SubscriptionEntryGetResponse.class);
        this.entityLinks = entityLinks;
    }

    @Override
    public SubscriptionEntryGetResponse toResource(SubscriptionEntry source) {
        SubscriptionEntryGetResponse target = new SubscriptionEntryGetResponse();

        target.setTag(source.getTag());
        target.setCreatedAt(source.getCreatedAt());
        target.setSeen(source.isSeen());

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
        Link self = entityLinks.linkToSingleResource(getOutputClass(), source.getId());
        target.add(self);

		if(source.getSubscription() != null) {
			Link subscription = entityLinks.linkFor(SubscriptionGetResponse.class, source.getSubscription().getId()).withRel("subscription");
			target.add(subscription);
		}

		if(source.getFeedEntry() != null) {
			target.add(new Link(source.getFeedEntry().getUrl(), "origin"));
		}
    }

}
