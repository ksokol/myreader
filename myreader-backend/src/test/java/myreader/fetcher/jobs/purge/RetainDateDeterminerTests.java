package myreader.fetcher.jobs.purge;

import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.repository.FeedEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class RetainDateDeterminerTests {

  private RetainDateDeterminer determiner;

  @Mock
  private FeedEntryRepository feedEntryRepository;

  private Subscription subscription;

  @BeforeEach
  void setUp() {
    determiner = new RetainDateDeterminer(feedEntryRepository, 2);
    subscription = new Subscription("url", "title");
    subscription.setId(1L);
    subscription.setResultSizePerFetch(5);
  }

  @Test
  void shouldNotDetermineRetainDateWhenEntryCountIsBelowThreshold() {
    given(feedEntryRepository.countBySubscriptionId(1L))
      .willReturn(1L);

    assertThat(determiner.determine(subscription))
      .isNotPresent();
  }

  @Test
  void shouldNotDetermineRetainDateWhenEntryCountIsEqualToThreshold() {
    given(feedEntryRepository.countBySubscriptionId(1L))
      .willReturn(5L);

    assertThat(determiner.determine(subscription))
      .isNotPresent();
  }

  @Test
  void shouldNotDetermineRetainDateWhenNoEntriesReturnedFromRepositoryQuery() {
    given(feedEntryRepository.countBySubscriptionId(1L))
      .willReturn(20L);
    given(feedEntryRepository.findBySubscriptionIdOrderByCreatedAtDesc(1L, PageRequest.of(0, 5)))
      .willReturn(new PageImpl<>(createEntries(0)));

    assertThat(determiner.determine(subscription))
      .isNotPresent();
  }

  @Test
  void shouldDetermineRetainDate() {
    given(feedEntryRepository.countBySubscriptionId(1L))
      .willReturn(20L);
    given(feedEntryRepository.findBySubscriptionIdOrderByCreatedAtDesc(1L, PageRequest.of(0, 5)))
      .willReturn(new PageImpl<>(createEntries(5)));

    assertThat(determiner.determine(this.subscription))
      .isPresent()
      .hasValue(new Date(5000));
  }

  private List<FeedEntry> createEntries(int index) {
    List<FeedEntry> entries = new ArrayList<>(index);
    var subscription = new Subscription("url", "feed");
    for (int i = 0; i < index; i++) {
      var feedEntry = new FeedEntry(subscription);
      feedEntry.setCreatedAt(new Date(index * 1000L));
      entries.add(feedEntry);
    }
    return entries;
  }
}
