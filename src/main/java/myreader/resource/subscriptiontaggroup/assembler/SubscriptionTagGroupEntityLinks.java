package myreader.resource.subscriptiontaggroup.assembler;

import myreader.resource.subscriptiontaggroup.SubscriptionTagGroupCollectionResource;
import myreader.resource.subscriptiontaggroup.beans.SubscriptionTagGroupGetResponse;

import org.springframework.stereotype.Component;

import spring.data.EntityLinksSupport;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionTagGroupEntityLinks extends EntityLinksSupport {

    public SubscriptionTagGroupEntityLinks() {
        super(SubscriptionTagGroupGetResponse.class, SubscriptionTagGroupCollectionResource.class);
    }
}
