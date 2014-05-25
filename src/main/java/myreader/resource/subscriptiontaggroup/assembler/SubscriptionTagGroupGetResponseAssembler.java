package myreader.resource.subscriptiontaggroup.assembler;

import myreader.entity.TagGroup;
import myreader.resource.subscription.SubscriptionCollectionResource;
import myreader.resource.subscription.SubscriptionEntityResource;
import myreader.resource.subscriptiontaggroup.SubscriptionTagGroupCollectionResource;
import myreader.resource.subscriptiontaggroup.SubscriptionTagGroupEntityResource;
import myreader.resource.subscriptiontaggroup.beans.SubscriptionTagGroupGetResponse;
import myreader.resource.utils.EncodeUtils;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * @author Kamill Sokol
 */
public class SubscriptionTagGroupGetResponseAssembler extends ResourceAssemblerSupport<TagGroup, SubscriptionTagGroupGetResponse> {

    public SubscriptionTagGroupGetResponseAssembler(Class<?> controllerClass) {
        super(controllerClass, SubscriptionTagGroupGetResponse.class);
    }

    @Override
    public SubscriptionTagGroupGetResponse toResource(TagGroup source) {
        SubscriptionTagGroupGetResponse target = new SubscriptionTagGroupGetResponse();
        target.setUnseen(source.getUnseen());
        target.setTag(source.getName());
		String encodeName = EncodeUtils.encodeAsUTF8(source.getName());

		Link self = linkTo(methodOn(SubscriptionTagGroupEntityResource.class).get(encodeName, null)).withSelfRel();
        target.add(self);

        switch(source.getType()) {
            case AGGREGATE:
                Link subscriptionsByTag = linkTo(methodOn(SubscriptionTagGroupCollectionResource.class).getSubscriptionsByTag(encodeName, null, null)).withRel("subscriptions");
                target.add(subscriptionsByTag);
                Link subscriptionEntriesByTag = linkTo(methodOn(SubscriptionTagGroupCollectionResource.class).getSubscriptionEntriesByTag(encodeName, null, null)).withRel("entries");
                target.add(subscriptionEntriesByTag);
                break;
            case SUBSCRIPTION:
                Link subscription = linkTo(methodOn(SubscriptionEntityResource.class).get(source.getId(), null)).withRel("subscription");
                target.add(subscription);
                Link subscriptionEntries = linkTo(methodOn(SubscriptionCollectionResource.class).getSubscriptionEntries(source.getId(), null, null)).withRel("entries");
                target.add(subscriptionEntries);
                break;
        }

        return target;
    }

}
