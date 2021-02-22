package myreader.service.subscription;

import myreader.entity.Subscription;
import myreader.fetcher.FeedParseException;
import myreader.fetcher.FeedParser;
import myreader.repository.SubscriptionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Objects;
import java.util.regex.Pattern;

@Component
public class SubscriptionService {

  private static final Logger log = LoggerFactory.getLogger(SubscriptionService.class);

  private static final Pattern ORIGIN_PATTERN = Pattern.compile("^https?://.*");

  private final SubscriptionRepository subscriptionRepository;
  private final FeedParser feedParser;

  public SubscriptionService(SubscriptionRepository subscriptionRepository, FeedParser feedParser) {
    this.subscriptionRepository = Objects.requireNonNull(subscriptionRepository, "subscriptionRepository is null");
    this.feedParser = Objects.requireNonNull(feedParser, "feedParser is null");
  }

  @Transactional
  public Subscription subscribe(String url) {
    var check = subscriptionRepository.findByUrl(url);

    if (check.isPresent()) {
      throw new SubscriptionExistException();
    }

    var parseResult = feedParser.parse(url).orElseThrow(IllegalArgumentException::new);

    return subscriptionRepository.save(
      new Subscription(url, parseResult.getTitle(), null, null, 0, null, 0, null, OffsetDateTime.now())
    );
  }

  public boolean valid(String url) {
    if (url == null || !ORIGIN_PATTERN.matcher(url).matches()) {
      return false;
    }

    try {
      feedParser.parse(url);
      return true;
    } catch (FeedParseException exception) {
      log.warn("couldn't parse feed. error: {}", exception.getMessage());
    }

    return false;
  }
}
