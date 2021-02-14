package myreader.resource.subscriptionentry.converter;

import myreader.entity.SubscriptionEntry;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.TreeSet;

@Component
public class SubscriptionEntryGetResponseConverter {

  public SubscriptionEntryGetResponse toModel(final SubscriptionEntry source) {
    var target = new SubscriptionEntryGetResponse();

    target.setUuid(source.getId().toString());

    if (source.getTags() != null) {
      target.setTags(new TreeSet<>(source.getTags()));
    } else {
      target.setTags(Set.of());
    }

    target.setCreatedAt(source.getCreatedAt());
    target.setSeen(source.isSeen());
    target.setOrigin(source.getUrl());
    target.setTitle(source.getTitle());
    target.setContent(source.getContent());

    var subscription = source.getSubscription();
    target.setFeedTitle(subscription.getTitle());
    target.setFeedUuid(subscription.getId().toString());
    target.setFeedTag(subscription.getTag());
    target.setFeedTagColor(subscription.getColor());

    return target;
  }
}
