package myreader.fetcher.jobs.purge;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
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
  private SubscriptionEntryRepository subscriptionEntryRepository;

  private Subscription subscription;

  @BeforeEach
  void setUp() {
    determiner = new RetainDateDeterminer(subscriptionEntryRepository, 2);
    subscription = new Subscription("url", "title");
    subscription.setId(1L);
    subscription.setResultSizePerFetch(5);
  }

  @Test
  void shouldNotDetermineRetainDateWhenEntryCountIsBelowThreshold() {
    given(subscriptionEntryRepository.countBySubscriptionId(1L))
      .willReturn(1L);

    assertThat(determiner.determine(subscription))
      .isNotPresent();
  }

  @Test
  void shouldNotDetermineRetainDateWhenEntryCountIsEqualToThreshold() {
    given(subscriptionEntryRepository.countBySubscriptionId(1L))
      .willReturn(5L);

    assertThat(determiner.determine(subscription))
      .isNotPresent();
  }

  @Test
  void shouldNotDetermineRetainDateWhenNoEntriesReturnedFromRepositoryQuery() {
    given(subscriptionEntryRepository.countBySubscriptionId(1L))
      .willReturn(20L);
    given(subscriptionEntryRepository.findBySubscriptionIdOrderByCreatedAtDesc(1L, PageRequest.of(0, 5)))
      .willReturn(new PageImpl<>(createEntries(0)));

    assertThat(determiner.determine(subscription))
      .isNotPresent();
  }

  @Test
  void shouldDetermineRetainDate() {
    given(subscriptionEntryRepository.countBySubscriptionId(1L))
      .willReturn(20L);
    given(subscriptionEntryRepository.findBySubscriptionIdOrderByCreatedAtDesc(1L, PageRequest.of(0, 5)))
      .willReturn(new PageImpl<>(createEntries(5)));

    assertThat(determiner.determine(this.subscription))
      .isPresent()
      .hasValue(new Date(5000));
  }

  private List<SubscriptionEntry> createEntries(int index) {
    List<SubscriptionEntry> entries = new ArrayList<>(index);
    var subscription = new Subscription("url", "feed");
    for (int i = 0; i < index; i++) {
      var subscriptionEntry = new SubscriptionEntry(subscription);
      subscriptionEntry.setCreatedAt(new Date(index * 1000L));
      entries.add(subscriptionEntry);
    }
    return entries;
  }
}
