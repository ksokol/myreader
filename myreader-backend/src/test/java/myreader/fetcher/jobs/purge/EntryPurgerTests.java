package myreader.fetcher.jobs.purge;

import myreader.repository.FeedEntryRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static myreader.fetcher.jobs.purge.EntryPurgerTests.PageBuilder.withElements;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

/**
 * @author Kamill Sokol
 */
@RunWith(MockitoJUnitRunner.class)
public class EntryPurgerTests {

    private EntryPurger purger;
    private PageRequest pageRequest;
    private Date retainDate;
    private Long feedId;

    @Mock
    private FeedEntryRepository feedEntryRepository;

    @Before
    public void setUp() {
        purger = new EntryPurger(feedEntryRepository, 2);
        pageRequest = PageRequest.of(0, 2);
        retainDate = new Date();
        feedId = 1L;
    }

    @Test
    public void shouldNotDeleteEntriesWhenNoErasableEntriesAvailable() {
        given(feedEntryRepository.findErasableEntryIdsBySubscriptionIdAndCreatedAtEarlierThanRetainDate(feedId, retainDate, pageRequest))
                .willReturn(withElements().withTotal(0));

        purger.purge(feedId, retainDate);

        verify(feedEntryRepository, never()).deleteById(anyLong());
    }

    @Test
    public void shouldDeleteAllErasableEntries() {
        given(feedEntryRepository.findErasableEntryIdsBySubscriptionIdAndCreatedAtEarlierThanRetainDate(feedId, retainDate, pageRequest))
                .willReturn(withElements(1L, 2L).withTotal(3))
                .willReturn(withElements(3L).withTotal(3))
                .willReturn(withElements().withTotal(3));

        purger.purge(feedId, retainDate);

        verify(feedEntryRepository).deleteById(1L);
        verify(feedEntryRepository).deleteById(2L);
        verify(feedEntryRepository).deleteById(3L);
    }

    static class PageBuilder {

        private final List<Long> ids;

        PageBuilder(List<Long> ids) {
            this.ids = ids;
        }

        static PageBuilder withElements(Long... ids) {
            return new PageBuilder(Arrays.asList(ids));
        }

        Page<Long> withTotal(long totalElements) {
            return new PageImpl<>(ids, PageRequest.of(0, 10), totalElements);
        }
    }
}
