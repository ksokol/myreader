package myreader.resource.subscription.assembler;

import myreader.entity.Subscription;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionGetResponseAssembler {

  public SubscriptionGetResponse toModel(Subscription source) {
    var target = new SubscriptionGetResponse();

    target.setUuid(source.getId().toString());
    target.setOrigin(source.getUrl());
    target.setCreatedAt(source.getCreatedAt());
    target.setSum(source.getFetchCount());
    target.setTitle(source.getTitle());
    target.setUnseen(source.getUnseen());
    target.setFetchErrorCount(source.getFetchErrorCount());
    target.setTag(source.getTag());
    target.setColor(source.getColor());

    return target;
  }
}
