package myreader.views.subscriptionpage;

import myreader.entity.ExclusionPattern;
import myreader.repository.ExclusionRepository;
import myreader.repository.FetchErrorRepository;
import myreader.repository.SubscriptionRepository;
import myreader.service.subscription.SubscriptionService;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import javax.servlet.ServletException;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.Objects;

import static java.util.stream.Collectors.toList;

@Component
public class SubscriptionPage {

  private final SubscriptionRepository subscriptionRepository;
  private final ExclusionRepository exclusionRepository;
  private final FetchErrorRepository fetchErrorRepository;
  private final SubscriptionService subscriptionService;

  public SubscriptionPage(
    SubscriptionRepository subscriptionRepository,
    ExclusionRepository exclusionRepository,
    FetchErrorRepository fetchErrorRepository,
    SubscriptionService subscriptionService
  ) {
    this.subscriptionRepository = Objects.requireNonNull(subscriptionRepository, "subscriptionRepository is null");
    this.exclusionRepository = Objects.requireNonNull(exclusionRepository, "exclusionRepository is null");
    this.fetchErrorRepository = Objects.requireNonNull(fetchErrorRepository, "fetchErrorRepository is null");
    this.subscriptionService = Objects.requireNonNull(subscriptionService, "subscriptionService is null");
  }

  public ServerResponse getPageData(ServerRequest request) {
    var id = Long.parseLong(request.pathVariable("id"));

    var subscription = subscriptionRepository
      .findById(id)
      .map(SubscriptionPageConverter::convertSubscription)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    var tags = subscriptionRepository.findDistinctTags();

    var exclusionPatterns = exclusionRepository.findBySubscriptionId(id).stream()
      .map(SubscriptionPageConverter::convertExclusionPattern)
      .collect(toList());

    var fetchErrors = fetchErrorRepository.findAllBySubscriptionIdOrderByCreatedAtDesc(id).stream()
      .map(SubscriptionPageConverter::convertFetchError)
      .collect(toList());

    return ServerResponse.ok().body(
      Map.of(
        "subscription", subscription,
        "tags", tags,
        "exclusionPatterns", exclusionPatterns,
        "fetchErrors", fetchErrors
      )
    );
  }

  public ServerResponse updateSubscription(ServerRequest request) throws ServletException, IOException {
    var id = Long.parseLong(request.pathVariable("id"));
    var body = request.body(new ParameterizedTypeReference<Map<String, Object>>() {
    });

    SubscriptionPageValidator.validateSubscriptionPatchRequest(body, subscriptionService);

    var subscription = subscriptionRepository
      .findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    subscription.setTitle((String) body.get("title"));
    subscription.setUrl((String) body.get("origin"));
    subscription.setTag((String) body.get("tag"));
    subscription.setColor((String) body.get("color"));
    subscription = subscriptionRepository.save(subscription);

    return ServerResponse.ok().body(
      Map.of(
        "subscription", SubscriptionPageConverter.convertSubscription(subscription)
      )
    );
  }

  public ServerResponse deleteSubscription(ServerRequest request) {
    var id = Long.parseLong(request.pathVariable("id"));

    var subscription = subscriptionRepository
      .findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    subscriptionRepository.delete(subscription);

    return ServerResponse.noContent().build();
  }

  public ServerResponse saveExclusionPattern(ServerRequest request) throws ServletException, IOException {
    var id = Long.parseLong(request.pathVariable("id"));
    var body = request.body(new ParameterizedTypeReference<Map<String, Object>>() {
    });
    var pattern = (String) body.get("pattern");

    SubscriptionPageValidator.validateExclusionPattern(pattern);

    var subscription = subscriptionRepository
      .findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    if (!exclusionRepository.existsBySubscriptionIdAndPattern(subscription.getId(), pattern)) {
      exclusionRepository.save(new ExclusionPattern(pattern, subscription.getId(), 0, OffsetDateTime.now()));
    }

    var exclusionPatterns = exclusionRepository.findBySubscriptionId(id).stream()
      .map(SubscriptionPageConverter::convertExclusionPattern)
      .collect(toList());

    return ServerResponse.ok().body(
      Map.of(
        "exclusionPatterns", exclusionPatterns
      )
    );
  }

  public ServerResponse deleteExclusionPattern(ServerRequest request) {
    var id = Long.parseLong(request.pathVariable("id"));
    var patternId = Long.parseLong(request.pathVariable("patternId"));

    var exclusionPattern = exclusionRepository
      .findByIdAndSubscriptionId(patternId, id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    exclusionRepository.deleteById(exclusionPattern.getId());

    var source = exclusionRepository.findBySubscriptionId(id);
    var exclusionPatterns = source.stream()
      .map(SubscriptionPageConverter::convertExclusionPattern)
      .collect(toList());

    return ServerResponse.ok().body(
      Map.of(
        "exclusionPatterns", exclusionPatterns
      )
    );
  }
}
