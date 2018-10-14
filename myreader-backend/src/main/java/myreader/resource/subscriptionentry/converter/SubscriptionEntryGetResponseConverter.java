package myreader.resource.subscriptionentry.converter;

import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.entity.SubscriptionTag;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionEntryGetResponseConverter extends ResourceAssemblerSupport<SubscriptionEntry, SubscriptionEntryGetResponse> {

    public SubscriptionEntryGetResponseConverter() {
        super(SubscriptionEntry.class, SubscriptionEntryGetResponse.class);
    }

    @Override
    public SubscriptionEntryGetResponse toResource(final SubscriptionEntry source) {
        SubscriptionEntryGetResponse target = new SubscriptionEntryGetResponse();

        target.setUuid(source.getId().toString());
        target.setTag(source.getTag());
        target.setCreatedAt(source.getCreatedAt());
        target.setSeen(source.isSeen());

        FeedEntry feedEntry = source.getFeedEntry();
        target.setOrigin(feedEntry.getUrl());
        target.setTitle(feedEntry.getTitle());
        target.setContent(feedEntry.getContent());

        Subscription subscription = source.getSubscription();
        target.setFeedTitle(subscription.getTitle());
        target.setFeedUuid(subscription.getId().toString());

        if(subscription.getSubscriptionTag() != null) {
            SubscriptionTag subscriptionTag = subscription.getSubscriptionTag();
            target.setFeedTag(subscriptionTag.getName());
            target.setFeedTagColor(subscriptionTag.getColor());
        }

        return target;
    }
}
