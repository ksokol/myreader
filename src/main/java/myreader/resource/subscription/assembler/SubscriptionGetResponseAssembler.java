package myreader.resource.subscription.assembler;

import myreader.entity.Subscription;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscriptiontaggroup.beans.SubscriptionTagGroupGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityLinks;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import spring.data.AbstractResourceAssembler;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionGetResponseAssembler extends AbstractResourceAssembler<Subscription,SubscriptionGetResponse> {

    private final EntityLinks entityLinks;

    @Autowired
    public SubscriptionGetResponseAssembler(EntityLinks entityLinks) {
        super(Subscription.class, SubscriptionGetResponse.class);
        this.entityLinks = entityLinks;
    }

    @Override
    public SubscriptionGetResponse toResource(Subscription source) {
        SubscriptionGetResponse target = new SubscriptionGetResponse();

        target.setTag(source.getTag());
        target.setCreatedAt(source.getCreatedAt());
        target.setSum(source.getSum());
        target.setTitle(source.getTitle());
        target.setUnseen(source.getUnseen());

        Link self = entityLinks.linkToSingleResource(getOutputClass(), source.getId());
        target.add(self);

        if(source.getFeed() != null) {
            Link origin = new Link(source.getFeed().getUrl(), "origin");
            target.add(origin);
        }

        Link subscriptionEntries = entityLinks.linkFor(getOutputClass(), source.getId()).slash("entries").withRel("entries");
        target.add(subscriptionEntries);

        if(StringUtils.hasText(source.getTag())) {
            Link subscriptionTagGroup = entityLinks.linkFor(SubscriptionTagGroupGetResponse.class, source.getTag()).withRel("subscriptionTagGroup");
            target.add(subscriptionTagGroup);
        }

        return target;
    }

}
