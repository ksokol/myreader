package myreader.fetcher.jobs;

import myreader.entity.Feed;
import myreader.fetcher.jobs.purge.EntryPurger;
import myreader.fetcher.jobs.purge.RetainDateDeterminer;
import myreader.repository.FeedRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Date;
import java.util.Optional;

import static java.util.Collections.singletonList;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

/**
 * @author Kamill Sokol
 */
@RunWith(MockitoJUnitRunner.class)
public class EntryPurgeJobTest {

    @InjectMocks
    private EntryPurgeJob job;

    @Mock
    private RetainDateDeterminer determiner;

    @Mock
    private EntryPurger entryPurger;

    @Mock
    private FeedRepository feedRepository;

    private Date retainDate;
    private Feed feed;

    @Before
    public void setUp() throws Exception {
        retainDate = new Date();
        feed = new Feed("feed");
        feed.setId(1L);
    }

    @Test
    public void shouldNotCallEntryPurgerWhenNoRetainDateDetermined() throws Exception {
        given(feedRepository.findAll()).willReturn(singletonList(feed));
        given(determiner.determine(feed)).willReturn(Optional.empty());

        job.work();

        verify(entryPurger, never()).purge(anyLong(), any());
    }

    @Test
    public void shouldCallEntryPurgerWhenRetainDateDetermined() throws Exception {
        given(feedRepository.findAll()).willReturn(singletonList(feed));
        given(determiner.determine(feed)).willReturn(Optional.of(retainDate));

        job.work();

        verify(entryPurger).purge(1L, retainDate);
    }
}
