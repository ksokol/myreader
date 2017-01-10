package myreader.fetcher;

import myreader.entity.Feed;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedEntryRepository;
import myreader.repository.FeedRepository;
import myreader.service.time.TimeService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import static java.util.Collections.emptyList;
import static java.util.Collections.singletonList;
import static java.util.stream.StreamSupport.stream;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@DataJpaTest(includeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = SubscriptionBatch.class))
@TestPropertySource(properties = { "task.enabled = false" })
@Sql("/test-data.sql")
public class SubscriptionBatchTest {

    private static final String KNOWN_FEED_URL = "http://feeds.feedburner.com/javaposse";
    private static final String ENTRY_TITLE = "Party time";
    private static final String ENTRY_GUID = "http://Use-The-Index-Luke.com";
    private static final String ENTRY_URL = "http://Use-The-Index-Luke.com/blog/2013-03/Party-Time";

    @Autowired
    private SubscriptionBatch subscriptionBatch;

    @Autowired
    private FeedRepository feedRepository;

    @Autowired
    private FeedEntryRepository feedEntryRepository;

    @MockBean
    private TimeService timeService;

    @Test
    public void shouldNotSaveFeedEntryWhenRFeedIsUnknown() {
        long expectedCount = stream(feedEntryRepository.findAll().spliterator(), false).count();

        subscriptionBatch.updateUserSubscriptions(new FetchResult("unknown feed"));

        assertThat(stream(feedEntryRepository.findAll().spliterator(), false).count(), is(expectedCount));
    }

    @Test
    public void shouldNotSaveFeedEntryWhenResultIsEmpty() {
        long expectedCount = stream(feedEntryRepository.findAll().spliterator(), false).count();

        subscriptionBatch.updateUserSubscriptions(new FetchResult(emptyList(), "last modified", "title", "unknown feed url", 0));

        assertThat(stream(feedEntryRepository.findAll().spliterator(), false).count(), is(expectedCount));
    }

    @Test
    public void shouldNotIncrementFetchedCountWhenNoNewFeedEntrySaved() {
        FetcherEntry fetcherEntry = createFetcherEntry();

        subscriptionBatch.updateUserSubscriptions(new FetchResult(singletonList(fetcherEntry), "last modified", "title", KNOWN_FEED_URL, 0));

        Feed feed = feedRepository.findByUrl(KNOWN_FEED_URL);

        assertThat(feed.getLastModified(), is("last modified"));
        assertThat(feed.getFetched(), is(282));
    }

    @Test
    public void shouldIncrementFetchedCountWhenNewFeedEntrySaved() {
        FetcherEntry fetcherEntry = createFetcherEntry();

        fetcherEntry.setTitle("new title");
        fetcherEntry.setGuid("new guid");
        fetcherEntry.setUrl("new url");

        FetchResult fetchResult = new FetchResult(singletonList(fetcherEntry), "last modified", "title", KNOWN_FEED_URL, 0);

        subscriptionBatch.updateUserSubscriptions(fetchResult);

        Feed feed = feedRepository.findByUrl(KNOWN_FEED_URL);

        assertThat(feed.getLastModified(), is("last modified"));
        assertThat(feed.getFetched(), is(283));
    }

    @Test
    public void shouldUpdateResultSizePerFetchWhenCountIsGreaterThanZero() throws Exception {
        FetchResult fetchResult = new FetchResult(emptyList(), null, null, KNOWN_FEED_URL, 10);

        subscriptionBatch.updateUserSubscriptions(fetchResult);
        Feed feed = feedRepository.findByUrl(KNOWN_FEED_URL);

        assertThat(feed.getResultSizePerFetch(), is(10));
    }

    @Test
    public void shouldNotUpdateResultSizePerFetchWhenCountIsZero() throws Exception {
        FetchResult fetchResult = new FetchResult(emptyList(), null, null, KNOWN_FEED_URL, 0);

        subscriptionBatch.updateUserSubscriptions(fetchResult);
        Feed feed = feedRepository.findByUrl(KNOWN_FEED_URL);

        assertThat(feed.getResultSizePerFetch(), is(1000));
    }

    private FetcherEntry createFetcherEntry() {
        FetcherEntry fetcherEntry = new FetcherEntry();
        fetcherEntry.setTitle(ENTRY_TITLE);
        fetcherEntry.setGuid(ENTRY_GUID);
        fetcherEntry.setUrl(ENTRY_URL);
        fetcherEntry.setFeedUrl(KNOWN_FEED_URL);
        return fetcherEntry;
    }
}
