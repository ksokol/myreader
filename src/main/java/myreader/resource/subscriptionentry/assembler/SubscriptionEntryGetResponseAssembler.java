package myreader.resource.subscriptionentry.assembler;

import myreader.entity.SubscriptionEntry;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;
import spring.hateoas.AbstractResourceAssembler;
import spring.hateoas.EntityLinks;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionEntryGetResponseAssembler extends AbstractResourceAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> {

    private final EntityLinks entityLinks;

    @Autowired
    public SubscriptionEntryGetResponseAssembler(EntityLinks entityLinks) {
        super(SubscriptionEntry.class, SubscriptionEntryGetResponse.class);
        this.entityLinks = entityLinks;
    }

    @Override
    public SubscriptionEntryGetResponse toResource(SubscriptionEntry source) {
        SubscriptionEntryGetResponse target = new SubscriptionEntryGetResponse();

        target.setUuid(String.valueOf(source.getId()));
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
