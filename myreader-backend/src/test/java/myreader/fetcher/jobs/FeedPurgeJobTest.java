package myreader.fetcher.jobs;

import myreader.entity.Feed;
import myreader.repository.FeedRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static java.util.Arrays.asList;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

/**
 * @author Kamill Sokol
 */
@RunWith(MockitoJUnitRunner.class)
public class FeedPurgeJobTest {

    @InjectMocks
    private FeedPurgeJob job;

    @Mock
    private FeedRepository feedRepository;

    @Test
    public void shouldDeleteFeeds() throws Exception {
        Feed feed1 = new Feed("feed1");
        Feed feed2 = new Feed("feed2");

        given(feedRepository.findByZeroSubscriptions()).willReturn(asList(feed1, feed2));
        job.work();

        verify(feedRepository).delete(feed1);
        verify(feedRepository).delete(feed2);
    }
}
