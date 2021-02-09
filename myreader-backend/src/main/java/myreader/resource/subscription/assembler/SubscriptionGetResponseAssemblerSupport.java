package myreader.resource.subscription.assembler;

import myreader.entity.Subscription;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionGetResponseAssemblerSupport extends RepresentationModelAssemblerSupport<Subscription, SubscriptionGetResponse> {

  public SubscriptionGetResponseAssemblerSupport() {
    super(Subscription.class, SubscriptionGetResponse.class);
  }

  @Override
  public SubscriptionGetResponse toModel(Subscription source) {
    var target = new SubscriptionGetResponse();

    target.setUuid(source.getId().toString());
    target.setOrigin(source.getUrl());
    target.setCreatedAt(source.getCreatedAt());
    target.setSum(source.getFetchCount());
    target.setTitle(source.getTitle());
    target.setUnseen(source.getUnseen());
    target.setFetchErrorCount(source.getFetchErrorCount());

    if (source.getSubscriptionTag() != null) {
      var subscriptionTag = source.getSubscriptionTag();
      var feedTag = new SubscriptionGetResponse.FeedTag();

      target.setFeedTag(feedTag);
      feedTag.setUuid(subscriptionTag.getId().toString());
      feedTag.setName(subscriptionTag.getName());
      feedTag.setColor(subscriptionTag.getColor());
      feedTag.setCreatedAt(subscriptionTag.getCreatedAt());
    }

    return target;
  }
}
