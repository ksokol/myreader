package myreader.resource.subscriptiontaggroup.assembler;

import myreader.entity.TagGroup;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscriptiontaggroup.beans.SubscriptionTagGroupGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;
import spring.hateoas.AbstractResourceAssembler;
import spring.hateoas.EntityLinks;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionTagGroupGetResponseAssembler extends AbstractResourceAssembler<TagGroup, SubscriptionTagGroupGetResponse> {

    private final EntityLinks entityLinks;

    @Autowired
    public SubscriptionTagGroupGetResponseAssembler(EntityLinks entityLinks) {
        super(TagGroup.class, SubscriptionTagGroupGetResponse.class);
        this.entityLinks = entityLinks;
    }

    @Override
    public SubscriptionTagGroupGetResponse toResource(TagGroup source) {
        SubscriptionTagGroupGetResponse target = new SubscriptionTagGroupGetResponse();

        target.setUnseen(source.getUnseen());
        target.setTag(source.getName());

        TagGroup.Type type = source.getType();

        if(type == null) {
            return target;
        }

        switch(type) {
            case AGGREGATE:
                target.setUuid(source.getName());
                Link subscriptionsByTag = entityLinks.linkFor(getOutputClass(), source.getName()).slash("subscriptions").withRel("subscriptions");
                target.add(subscriptionsByTag);
                Link subscriptionEntriesByTag = entityLinks.linkFor(getOutputClass(), source.getName()).slash("entries").withRel("entries");
                target.add(subscriptionEntriesByTag);
                Link newSubscriptionEntriesByTag = entityLinks.linkFor(getOutputClass(), source.getName()).slash("entries").slash("new").withRel
                        ("entries(seen=true)");
                target.add(newSubscriptionEntriesByTag);
                break;
            case SUBSCRIPTION:
                target.setUuid(String.valueOf(source.getId()));
                Link subscription = entityLinks.linkFor(SubscriptionGetResponse.class, source.getId()).withRel("subscription");
                target.add(subscription);
                Link subscriptionEntries = entityLinks.linkFor(SubscriptionGetResponse.class, source.getId()).slash("entries").withRel("entries");
                target.add(subscriptionEntries);
                break;
            default:
                break;
        }

        return target;
    }

}
