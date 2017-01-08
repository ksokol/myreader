package myreader.fetcher.jobs.purge;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.repository.FeedEntryRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;

/**
 * @author Kamill Sokol
 */
@RunWith(MockitoJUnitRunner.class)
public class RetainDateDeterminerTest {

    private RetainDateDeterminer determiner;

    @Mock
    private FeedEntryRepository feedEntryRepository;

    private Feed feed;

    @Before
    public void setUp() throws Exception {
        determiner = new RetainDateDeterminer(feedEntryRepository, 2);
        feed = new Feed("feed");
        feed.setId(1L);
        feed.setResultSizePerFetch(5);
    }

    @Test
    public void shouldNotDetermineRetainDateWhenEntryCountIsBelowThreshold() throws Exception {
        given(feedEntryRepository.countByFeedId(1L)).willReturn(1L);

        Optional<Date> determine = determiner.determine(feed);

        assertThat(determine.isPresent(), is(false));
    }

    @Test
    public void shouldNotDetermineRetainDateWhenEntryCountIsEqualToThreshold() throws Exception {
        given(feedEntryRepository.countByFeedId(1L)).willReturn(5L);

        Optional<Date> determine = determiner.determine(feed);

        assertThat(determine.isPresent(), is(false));
    }

    @Test
    public void shouldNotDetermineRetainDateWhenNoEntriesReturnedFromRepositoryQuery() throws Exception {
        given(feedEntryRepository.countByFeedId(1L)).willReturn(20L);
        given(feedEntryRepository.findByFeedIdOrderByCreatedAtDesc(1L, new PageRequest(0, 5))).willReturn(new PageImpl<>(createEntries(0)));

        Optional<Date> determine = determiner.determine(feed);

        assertThat(determine.isPresent(), is(false));
    }

    @Test
    public void shouldDetermineRetainDate() throws Exception {
        given(feedEntryRepository.countByFeedId(1L)).willReturn(20L);
        given(feedEntryRepository.findByFeedIdOrderByCreatedAtDesc(1L, new PageRequest(0, 5))).willReturn(new PageImpl<>(createEntries(5)));

        Optional<Date> determine = determiner.determine(this.feed);

        assertThat(determine.isPresent(), is(true));
        determine.ifPresent(date -> assertThat(date.getTime(), is(5000L)));
    }

    private List<FeedEntry> createEntries(int index) {
        ArrayList<FeedEntry> entries = new ArrayList<>(index);
        Feed feed = new Feed("feed");
        for(int i=0;i<index;i++) {
            FeedEntry feedEntry = new FeedEntry(feed);
            feedEntry.setCreatedAt(new Date(index * 1000L));
            entries.add(feedEntry);
        }
        return entries;
    }
}
