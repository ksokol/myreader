package myreader.resource.subscription.assembler;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import org.springframework.stereotype.Component;
import spring.hateoas.AbstractResourceAssembler;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionGetResponseAssembler extends AbstractResourceAssembler<Subscription,SubscriptionGetResponse> {

    public SubscriptionGetResponseAssembler() {
        super(Subscription.class, SubscriptionGetResponse.class);
    }

    @Override
    public SubscriptionGetResponse toResource(Subscription source) {
        SubscriptionGetResponse target = new SubscriptionGetResponse();

        target.setUuid(String.valueOf(source.getId()));
        target.setTag(source.getTag());
        target.setCreatedAt(source.getCreatedAt());
        target.setSum(source.getSum());
        target.setTitle(source.getTitle());
        target.setUnseen(source.getUnseen());

        final Feed feed = source.getFeed();
        if(feed == null) {
            return target;
        }

        target.setOrigin(feed.getUrl());

        return target;
    }

}
