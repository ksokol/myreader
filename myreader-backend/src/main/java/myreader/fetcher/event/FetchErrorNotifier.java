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
    Objects.requireNonNull(subscriptionRepository, "subscriptionRepository is null");
    Objects.requireNonNull(fetchErrorRepository, "fetchErrorRepository is null");
    this.subscriptionRepository = subscriptionRepository;
    this.fetchErrorRepository = fetchErrorRepository;
  }

  @EventListener
  public void processFetchErrorEvent(FetchErrorEvent event) {
    subscriptionRepository.findByUrl(event.getFeedUrl()).ifPresent(subscription -> {
      FetchError fetchError = new FetchError();
      fetchError.setSubscription(subscription);
      fetchError.setMessage(event.getErrorMessage());
      fetchError.setCreatedAt(event.getCreatedAt());
      fetchErrorRepository.save(fetchError);
    });
  }
}
