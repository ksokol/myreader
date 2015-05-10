package myreader.resource.subscriptionentry.assembler;

import org.springframework.stereotype.Component;

import myreader.entity.SubscriptionEntry;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import spring.hateoas.AbstractResourceAssembler;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionEntryGetResponseAssembler extends AbstractResourceAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> {

    public SubscriptionEntryGetResponseAssembler() {
        super(SubscriptionEntry.class, SubscriptionEntryGetResponse.class);
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
            target.setFeedUuid(String.valueOf(source.getSubscription().getId()));
            target.setFeedTag(source.getSubscription().getTag());
        }

        if(source.getFeedEntry() != null) {
            target.setOrigin(source.getFeedEntry().getUrl());
        }

        return target;
    }

}
