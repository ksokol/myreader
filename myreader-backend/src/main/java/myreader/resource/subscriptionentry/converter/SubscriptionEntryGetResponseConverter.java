package myreader.resource.subscriptionentry.converter;

import myreader.entity.SubscriptionEntry;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.TreeSet;

@Component
public class SubscriptionEntryGetResponseConverter extends RepresentationModelAssemblerSupport<SubscriptionEntry, SubscriptionEntryGetResponse> {

  public SubscriptionEntryGetResponseConverter() {
    super(SubscriptionEntry.class, SubscriptionEntryGetResponse.class);
  }

  @Override
  public SubscriptionEntryGetResponse toModel(final SubscriptionEntry source) {
    var target = new SubscriptionEntryGetResponse();

    target.setUuid(source.getId().toString());

    if (source.getTags() != null) {
      target.setTags(new TreeSet<>(source.getTags()));
    } else {
      target.setTags(Collections.emptySet());
    }

    target.setCreatedAt(source.getCreatedAt());
    target.setSeen(source.isSeen());

    target.setOrigin(source.getUrl());
    target.setTitle(source.getTitle());
    target.setContent(source.getContent());

    var subscription = source.getSubscription();
    target.setFeedTitle(subscription.getTitle());
    target.setFeedUuid(subscription.getId().toString());

    if (subscription.getSubscriptionTag() != null) {
      var subscriptionTag = subscription.getSubscriptionTag();
      target.setFeedTag(subscriptionTag.getName());
      target.setFeedTagColor(subscriptionTag.getColor());
    }

    return target;
  }
}
