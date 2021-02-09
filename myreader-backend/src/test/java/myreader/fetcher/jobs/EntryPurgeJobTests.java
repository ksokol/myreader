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

import java.util.Date;
import java.util.Optional;

import static java.util.Collections.singletonList;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyLong;
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

  private Date retainDate;
  private Subscription subscription;

  @BeforeEach
  void setUp() {
    retainDate = new Date();
    subscription = new Subscription("url", "title");
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
    given(determiner.determine(subscription)).willReturn(Optional.of(retainDate));

    job.work();

    verify(entryPurger).purge(1L, retainDate);
  }
}
