package myreader.resource.subscription.assembler;

import myreader.entity.Subscription;
import myreader.repository.FetchErrorRepository;
import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class SubscriptionGetResponseAssembler {

  private final FetchErrorRepository fetchErrorRepository;
  private final SubscriptionEntryRepository subscriptionEntryRepository;

  public SubscriptionGetResponseAssembler(FetchErrorRepository fetchErrorRepository, SubscriptionEntryRepository subscriptionEntryRepository) {
    this.fetchErrorRepository = Objects.requireNonNull(fetchErrorRepository, "fetchErrorRepository is null");
    this.subscriptionEntryRepository = Objects.requireNonNull(subscriptionEntryRepository, "subscriptionEntryRepository is null");
  }

  public SubscriptionGetResponse toModel(Subscription source) {
    var target = new SubscriptionGetResponse();

    target.setUuid(source.getId().toString());
    target.setOrigin(source.getUrl());
    target.setCreatedAt(source.getCreatedAt());
    target.setSum(source.getAcceptedFetchCount());
    target.setTitle(source.getTitle());
    target.setTag(source.getTag());
    target.setColor(source.getColor());

    target.setUnseen(subscriptionEntryRepository.countUnseenBySubscriptionId(source.getId()));
    target.setFetchErrorCount(fetchErrorRepository.countBySubscriptionId(source.getId()));

    return target;
  }
}
