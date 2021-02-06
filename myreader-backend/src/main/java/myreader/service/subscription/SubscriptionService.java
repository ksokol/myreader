package myreader.service.subscription;

import myreader.entity.Subscription;
import myreader.repository.SubscriptionRepository;
import myreader.service.feed.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

@Service
public class SubscriptionService {

  private final SubscriptionRepository subscriptionRepository;
  private final FeedService feedService;
  private final Clock clock;

  @Autowired
  public SubscriptionService(SubscriptionRepository subscriptionRepository, FeedService feedService, Clock clock) {
    this.subscriptionRepository = subscriptionRepository;
    this.feedService = feedService;
    this.clock = clock;
  }

  @Transactional
  public Subscription subscribe(String url) {
    var check = subscriptionRepository.findByFeedUrl(url);

    if (check.isPresent()) {
      throw new SubscriptionExistException();
    }

    var feed = feedService.findByUrl(url);

    var subscription = new Subscription();
    subscription.setTitle(feed.getTitle());
    subscription.setFeed(feed);
    subscription.setCreatedAt(now());
    return subscriptionRepository.save(subscription);
  }

  private Date now() {
    return Date.from(LocalDateTime.now(clock).toInstant(ZoneOffset.UTC));
  }
}
