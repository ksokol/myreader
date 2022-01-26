package myreader.fetcher.jobs;

import myreader.entity.Subscription;
import myreader.fetcher.jobs.purge.EntryPurger;
import myreader.fetcher.jobs.purge.RetainDateDeterminer;
import myreader.repository.SubscriptionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static java.util.Collections.singletonList;
import static myreader.test.OffsetDateTimes.ofEpochMilli;
import static org.mockito.BDDMockito.given;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class EntryPurgeJobTests {

  @InjectMocks
  private EntryPurgeJob job;

  @Mock
  private RetainDateDeterminer determiner;

  @Mock
  private EntryPurger entryPurger;

  @Mock
  private SubscriptionRepository subscriptionRepository;

  private Subscription subscription;

  @BeforeEach
  void setUp() {
    subscription = new Subscription(
      "url",
      "title",
      null,
      null,
      0,
      null,
      0,
      null,
      false,
      ofEpochMilli(1000)
    );
    subscription.setId(1L);
  }

  @Test
  void shouldNotCallEntryPurgerWhenNoRetainDateDetermined() {
    given(subscriptionRepository.findAll()).willReturn(singletonList(subscription));
    given(determiner.determine(subscription)).willReturn(Optional.empty());

    job.work();

    verify(entryPurger, never()).purge(anyLong(), any());
  }

  @Test
  void shouldCallEntryPurgerWhenRetainDateDetermined() {
    given(subscriptionRepository.findAll()).willReturn(singletonList(subscription));
    given(determiner.determine(subscription)).willReturn(Optional.of(ofEpochMilli(1000)));

    job.work();

    verify(entryPurger).purge(1L, ofEpochMilli(1000));
  }
}
