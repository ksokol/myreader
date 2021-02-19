package myreader.fetcher.event;

import myreader.entity.FetchError;
import myreader.repository.FetchErrorRepository;
import myreader.repository.SubscriptionRepository;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class FetchErrorNotifier {

  private final SubscriptionRepository subscriptionRepository;
  private final FetchErrorRepository fetchErrorRepository;

  public FetchErrorNotifier(SubscriptionRepository subscriptionRepository, FetchErrorRepository fetchErrorRepository) {
    this.subscriptionRepository = Objects.requireNonNull(subscriptionRepository, "subscriptionRepository is null");
    this.fetchErrorRepository = Objects.requireNonNull(fetchErrorRepository, "fetchErrorRepository is null");
  }

  @EventListener
  public void processFetchErrorEvent(FetchErrorEvent event) {
    subscriptionRepository.findByUrl(event.getFeedUrl())
      .ifPresent(subscription ->
        fetchErrorRepository.save(new FetchError(subscription.getId(), event.getErrorMessage(), event.getCreatedAt())
        )
      );
  }
}
