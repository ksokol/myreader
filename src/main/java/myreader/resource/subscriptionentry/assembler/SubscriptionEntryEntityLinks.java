package myreader.resource.subscriptionentry.assembler;

import myreader.resource.subscriptionentry.SubscriptionEntryCollectionResource;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;

import spring.data.EntityLinksSupport;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionEntryEntityLinks extends EntityLinksSupport {

    @Autowired
    public SubscriptionEntryEntityLinks(PagedResourcesAssembler pagedResourcesAssembler) {
        super(SubscriptionEntryGetResponse.class, SubscriptionEntryCollectionResource.class, pagedResourcesAssembler);
    }

    @Override
    public Link linkToCollectionResource(Class<?> type) {
        return with(type).pagination().requestParam("q").link();
    }
}
