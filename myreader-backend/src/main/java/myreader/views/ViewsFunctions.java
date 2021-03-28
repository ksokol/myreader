package myreader.views;

import myreader.views.subscriptionpage.SubscriptionPage;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import java.util.Map;
import java.util.Objects;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.web.servlet.function.RequestPredicates.accept;
import static org.springframework.web.servlet.function.RouterFunctions.route;

@Configuration
public class ViewsFunctions {

  private final SubscriptionPage subscriptionPage;

  public ViewsFunctions(SubscriptionPage subscriptionPage) {
    this.subscriptionPage = Objects.requireNonNull(subscriptionPage, "subscriptionPage is null");
  }

  @Bean
  public RouterFunction<ServerResponse> routes() {
    return route()
      .GET("/views/SubscriptionPage/{id}", accept(APPLICATION_JSON), subscriptionPage::getPageData)
      .PATCH("/views/SubscriptionPage/{id}/subscription", accept(APPLICATION_JSON), subscriptionPage::updateSubscription)
      .DELETE("/views/SubscriptionPage/{id}/subscription", accept(APPLICATION_JSON), subscriptionPage::deleteSubscription)
      .POST("/views/SubscriptionPage/{id}/exclusionPatterns", accept(APPLICATION_JSON), subscriptionPage::saveExclusionPattern)
      .DELETE("/views/SubscriptionPage/{id}/exclusionPatterns/{patternId}", accept(APPLICATION_JSON), subscriptionPage::deleteExclusionPattern)
      .onError(ValidationErrors.ValidationException.class, ViewsFunctions::onValidationError)
      .build();
  }

  private static ServerResponse onValidationError(Throwable exception, ServerRequest request) {
    return ServerResponse.badRequest()
      .body(
        Map.of("errors", ((ValidationErrors.ValidationException) exception).errors)
      );
  }
}
