package myreader.resource.subscriptiontaggroup.assembler;

import myreader.resource.subscriptiontaggroup.SubscriptionTagGroupCollectionResource;
import myreader.resource.subscriptiontaggroup.beans.SubscriptionTagGroupGetResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;

import spring.data.EntityLinksSupport;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionTagGroupEntityLinks extends EntityLinksSupport {

    @Autowired
    public SubscriptionTagGroupEntityLinks(PagedResourcesAssembler pagedResourcesAssembler) {
        super(SubscriptionTagGroupGetResponse.class, SubscriptionTagGroupCollectionResource.class, pagedResourcesAssembler);
    }

    @Override
    public Link linkToCollectionResource(Class<?> type) {
        return with(type).pagination().requestParam("q").link();
    }

}
