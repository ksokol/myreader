package myreader.fetcher.impl;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.core.Is.is;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;

import myreader.entity.Feed;
import myreader.entity.FetchStatistics;
import myreader.entity.SubscriptionEntry;
import myreader.fetcher.SubscriptionBatch;
import myreader.fetcher.SubscriptionEntryBatch;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedRepository;
import myreader.repository.FetchStatisticRepository;
import myreader.repository.SubscriptionEntryRepository;
import myreader.service.time.TimeService;
import myreader.test.IntegrationTestSupport;
import org.joda.time.LocalDateTime;
import org.junit.Test;
import org.mockito.Matchers;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * @author Kamill Sokol
 */
public class SubscriptionBatchImplTest extends IntegrationTestSupport {

    private SubscriptionBatch uut;

    @Autowired
    private FeedRepository feedRepository;

    @Autowired
    private SubscriptionBatch subscriptionBatch;

    @Autowired
    private FetchStatisticRepository fetchStatisticRepository;

    @Autowired
    private TimeService timeServiceMock;

    private SubscriptionEntryBatch subscriptionEntryBatchMock = mock(SubscriptionEntryBatch.class);
    private SubscriptionEntryRepository subscriptionEntryRepository = mock(SubscriptionEntryRepository.class);


    public void beforeTest() {
        reset(subscriptionEntryBatchMock);
        reset(subscriptionEntryRepository);

        uut = new SubscriptionBatchImpl(feedRepository, subscriptionEntryBatchMock, subscriptionEntryRepository);
    }

    @Test
    public void testUpdateUserSubscriptions() {
        String url = "http://feeds.feedburner.com/javaposse";

        Feed before = feedRepository.findByUrl(url);
        assertThat(before.getLastModified(), is("Thu, 27 Mar 2014 13:23:32 GMT"));
        assertThat(before.getFetched(), is(282));

        FetchResult fetchResult = new FetchResult(Collections.<FetcherEntry>emptyList(), "last modified", "title");
        fetchResult.setUrl(url);

        when(subscriptionEntryBatchMock.updateUserSubscriptionEntries(Matchers.<Feed>anyObject(), Matchers.<List<FetcherEntry>>anyObject())).thenReturn(Arrays.asList(new SubscriptionEntry()));

        uut.updateUserSubscriptions(fetchResult);

        Feed after = feedRepository.findByUrl(url);

        assertThat(after.getLastModified(), is("last modified"));
        assertThat(after.getFetched(), is(283));
    }

    @Test
    public void testFetchStatistic() {
        final LocalDateTime localDateTime = new LocalDateTime("2015-01-01T00:00:00");
        when(timeServiceMock.getCurrentTime()).thenReturn(localDateTime.toDate(), localDateTime.plusMinutes(1).toDate());

        final List<FetchStatistics> all = fetchStatisticRepository.findAll();
        assertThat(all, hasSize(0));

        subscriptionBatch.updateUserSubscriptions(new FetchResult("http://feeds.feedburner.com/AllAtlassianBlogs"));

        final List<FetchStatistics> all2 = fetchStatisticRepository.findAll();

        assertThat(all2, hasSize(1));
    }

    @Test
    public void testUnknownFeed() {
        final FetchResult fetchResult = new FetchResult("irrelevant" + UUID.randomUUID().toString());

        final long count = uut.updateUserSubscriptions(fetchResult);

        assertThat(count, is(0L));
    }
}
