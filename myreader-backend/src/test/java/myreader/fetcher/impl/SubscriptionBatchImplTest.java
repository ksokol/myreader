package myreader.fetcher.impl;

import myreader.entity.Feed;
import myreader.fetcher.SubscriptionBatch;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedEntryRepository;
import myreader.repository.FeedRepository;
import myreader.service.time.TimeService;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static java.util.Collections.emptyList;
import static java.util.Collections.singletonList;
import static java.util.stream.StreamSupport.stream;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

/**
 * @author Kamill Sokol
 */
public class SubscriptionBatchImplTest extends IntegrationTestSupport {

    private static final String KNOWN_FEED_URL = "http://feeds.feedburner.com/javaposse";
    private static final String ENTRY_TITLE = "Party time";
    private static final String ENTRY_GUID = "http://Use-The-Index-Luke.com";
    private static final String ENTRY_URL = "http://Use-The-Index-Luke.com/blog/2013-03/Party-Time";

    private SubscriptionBatch uut;

    @Autowired
    private FeedRepository feedRepository;

    @Autowired
    private FeedEntryRepository feedEntryRepository;

    @Autowired
    private TimeService timeServiceMock;

    public void beforeTest() {
        uut = new SubscriptionBatchImpl(feedRepository, feedEntryRepository, timeServiceMock);
    }

    @Test
    public void testUpdateUserSubscriptions1() {
        long expectedCount = stream(feedEntryRepository.findAll().spliterator(), false).count();

        uut.updateUserSubscriptions(new FetchResult("unknown feed"));

        assertThat(stream(feedEntryRepository.findAll().spliterator(), false).count(), is(expectedCount));
    }

    @Test
    public void testUpdateUserSubscriptions() {
        long expectedCount = stream(feedEntryRepository.findAll().spliterator(), false).count();

        uut.updateUserSubscriptions(new FetchResult(emptyList(), "last modified", "title", "unknown feed url"));

        assertThat(stream(feedEntryRepository.findAll().spliterator(), false).count(), is(expectedCount));
    }

    @Test
    public void testUpdateUserSubscriptions11() {
        FetcherEntry fetcherEntry = createFetcherEntry();

        uut.updateUserSubscriptions(new FetchResult(singletonList(fetcherEntry), "last modified", "title", KNOWN_FEED_URL));

        Feed feed = feedRepository.findByUrl(KNOWN_FEED_URL);

        assertThat(feed.getLastModified(), is("last modified"));
        assertThat(feed.getFetched(), is(282));
    }

    @Test
    public void testUpdateUserSubscriptions111() {
        FetcherEntry fetcherEntry = createFetcherEntry();

        fetcherEntry.setTitle("new title");
        fetcherEntry.setGuid("new guid");
        fetcherEntry.setUrl("new url");

        FetchResult fetchResult = new FetchResult(singletonList(fetcherEntry), "last modified", "title", KNOWN_FEED_URL);

        uut.updateUserSubscriptions(fetchResult);

        Feed feed = feedRepository.findByUrl(KNOWN_FEED_URL);

        assertThat(feed.getLastModified(), is("last modified"));
        assertThat(feed.getFetched(), is(283));
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
