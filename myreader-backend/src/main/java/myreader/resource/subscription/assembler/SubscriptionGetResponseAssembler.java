package myreader.resource.subscription.assembler;

import myreader.entity.SubscriptionView;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionGetResponseAssembler {

  public SubscriptionGetResponse toModel(SubscriptionView source) {
    var target = new SubscriptionGetResponse();

    target.setUuid(source.getId().toString());
    target.setOrigin(source.getUrl());
    target.setCreatedAt(source.getCreatedAt());
    target.setSum(source.getAcceptedFetchCount());
    target.setTitle(source.getTitle());
    target.setTag(source.getTag());
    target.setColor(source.getColor());
    target.setUnseen(source.getUnseen());
    target.setFetchErrorCount(source.getFetchErrorCount());

    return target;
  }
}
