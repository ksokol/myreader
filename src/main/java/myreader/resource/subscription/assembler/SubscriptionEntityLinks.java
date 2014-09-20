package myreader.resource.subscription.assembler;

import myreader.resource.subscription.SubscriptionCollectionResource;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.stereotype.Component;
import spring.data.EntityLinksSupport;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionEntityLinks extends EntityLinksSupport {

    @Autowired
    public SubscriptionEntityLinks(PagedResourcesAssembler pagedResourcesAssembler) {
        super(SubscriptionGetResponse.class, SubscriptionCollectionResource.class, pagedResourcesAssembler);
    }
}
