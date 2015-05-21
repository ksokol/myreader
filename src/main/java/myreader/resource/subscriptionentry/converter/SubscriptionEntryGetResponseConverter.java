package myreader.resource.subscriptionentry.converter;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import myreader.entity.SubscriptionEntry;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import spring.hateoas.AbstractResourceAssembler;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionEntryGetResponseConverter extends AbstractResourceAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> implements Converter<SubscriptionEntry, SubscriptionEntryGetResponse> {

    public SubscriptionEntryGetResponseConverter() {
        super(SubscriptionEntry.class, SubscriptionEntryGetResponse.class);
    }

    @Override
    public SubscriptionEntryGetResponse convert(final SubscriptionEntry source) {
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

    @Override
    public SubscriptionEntryGetResponse toResource(final SubscriptionEntry entity) {
        return convert(entity);
    }
}
