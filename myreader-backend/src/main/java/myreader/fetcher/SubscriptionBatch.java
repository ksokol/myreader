package myreader.fetcher;

import myreader.entity.FeedEntry;
import myreader.fetcher.persistence.FetchResult;
import myreader.repository.FeedEntryRepository;
import myreader.repository.SubscriptionRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

@Component
public class SubscriptionBatch {

  private final SubscriptionRepository subscriptionRepository;
  private final FeedEntryRepository feedEntryRepository;
  private final Clock clock;

  public SubscriptionBatch(
    SubscriptionRepository subscriptionRepository,
    FeedEntryRepository feedEntryRepository,
    Clock clock) {
    this.subscriptionRepository = subscriptionRepository;
    this.feedEntryRepository = feedEntryRepository;
    this.clock = clock;
  }

  @Transactional
  public void updateUserSubscriptions(FetchResult fetchResult) {
    subscriptionRepository.findByUrl(fetchResult.getUrl()).ifPresent(subscription -> {
      var newCount = 0;

      for (var dto : fetchResult.getEntries()) {
        var result = feedEntryRepository.countByTitleOrGuidOrUrlAndSubscriptionId(
          dto.getTitle(),
          dto.getGuid(),
          dto.getUrl(),
          subscription.getId()
        );

        if (result == 0) {
          var feedEntry = new FeedEntry(subscription);
          feedEntry.setContent(dto.getContent());
          feedEntry.setGuid(dto.getGuid());
          feedEntry.setTitle(dto.getTitle());
          feedEntry.setUrl(dto.getUrl());
          feedEntry.setCreatedAt(now());

          feedEntryRepository.save(feedEntry);

          newCount++;
        }
      }

      subscription.setLastModified(fetchResult.getLastModified());
      subscription.setFetched(subscription.getFetched() + newCount);

      if (fetchResult.getResultSizePerFetch() > 0) {
        subscription.setResultSizePerFetch(fetchResult.getResultSizePerFetch());
      }

      subscriptionRepository.save(subscription);
    });
  }

  private Date now() {
    return Date.from(LocalDateTime.now(clock).toInstant(ZoneOffset.UTC));
  }
}
