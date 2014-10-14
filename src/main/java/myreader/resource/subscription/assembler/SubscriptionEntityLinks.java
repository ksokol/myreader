package myreader.resource.subscription.assembler;

import myreader.resource.subscription.SubscriptionCollectionResource;
import myreader.resource.subscription.beans.SubscriptionGetResponse;

import org.springframework.stereotype.Component;

import spring.data.EntityLinksSupport;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionEntityLinks extends EntityLinksSupport {

    public SubscriptionEntityLinks() {
        super(SubscriptionGetResponse.class, SubscriptionCollectionResource.class);
    }
}
