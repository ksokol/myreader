package myreader.fetcher.jobs.purge;

import myreader.repository.SubscriptionEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class EntryPurgerTests {

  private EntryPurger purger;
  private PageRequest pageRequest;
  private Date retainDate;
  private Long feedId;

  @Mock
  private SubscriptionEntryRepository subscriptionEntryRepository;

  @BeforeEach
  void setUp() {
    purger = new EntryPurger(subscriptionEntryRepository, 2);
    pageRequest = PageRequest.of(0, 2);
    retainDate = new Date();
    feedId = 1L;
  }

  @Test
  void shouldNotDeleteEntriesWhenNoErasableEntriesAvailable() {
    given(subscriptionEntryRepository.findAllIdsBySubscriptionIdAndTagsNotEmptyAndCreatedAt(feedId, retainDate, pageRequest))
      .willReturn(withPage(0));

    purger.purge(feedId, retainDate);

    verify(subscriptionEntryRepository, never()).deleteById(anyLong());
  }

  @Test
  void shouldDeleteAllErasableEntries() {
    given(subscriptionEntryRepository.findAllIdsBySubscriptionIdAndTagsNotEmptyAndCreatedAt(feedId, retainDate, pageRequest))
      .willReturn(withPage(3, 1L, 2L))
      .willReturn(withPage(3, 3L))
      .willReturn(withPage(3));

    purger.purge(feedId, retainDate);

    verify(subscriptionEntryRepository).deleteById(1L);
    verify(subscriptionEntryRepository).deleteById(2L);
    verify(subscriptionEntryRepository).deleteById(3L);
  }

  private Page<Long> withPage(long totalElements, Long... ids) {
    return new PageImpl<>(List.of(ids), PageRequest.of(0, 10), totalElements);
  }
}
