package myreader.resource.subscriptionentry.assembler;

import myreader.resource.subscriptionentry.SubscriptionEntryCollectionResource;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;

import org.springframework.stereotype.Component;

import spring.data.EntityLinksSupport;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionEntryEntityLinks extends EntityLinksSupport {

    public SubscriptionEntryEntityLinks() {
        super(SubscriptionEntryGetResponse.class, SubscriptionEntryCollectionResource.class);
    }
}
