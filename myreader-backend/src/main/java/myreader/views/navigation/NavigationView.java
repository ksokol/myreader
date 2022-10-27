package myreader.views.navigation;

import myreader.repository.SubscriptionViewRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import java.util.Map;
import java.util.stream.Collectors;

@Component
public class NavigationView {

  private final SubscriptionViewRepository subscriptionViewRepository;

  public NavigationView(SubscriptionViewRepository subscriptionViewRepository) {
    this.subscriptionViewRepository = subscriptionViewRepository;
  }

  public ServerResponse getData(@SuppressWarnings({"unused", "java:S1172"}) ServerRequest request) {
    var target = subscriptionViewRepository.findAllByOrderByCreatedAtDesc().stream()
      .map(NavigationConverter::convert)
      .collect(Collectors.toList());

    return ServerResponse.ok().body(
      Map.of(
        "subscriptions", target
      )
    );
  }
}
