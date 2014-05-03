package myreader.service.subscription.impl;

import myreader.config.PersistenceConfig;
import myreader.entity.Feed;
import myreader.entity.SubscriptionEntry;
import myreader.fetcher.FeedParser;
import myreader.fetcher.impl.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedRepository;
import myreader.repository.FetchStatisticRepository;
import myreader.service.search.SubscriptionEntrySearchService;
import myreader.service.subscriptionentry.SubscriptionEntryBatchService;
import myreader.test.TestDataSourceConfig;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Matchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.*;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {PersistenceConfig.class, TestDataSourceConfig.class})
@Transactional
public class SubscriptionBatchServiceImplTest {

    private SubscriptionBatchServiceImpl uut;

    @Autowired
    private FeedRepository feedRepository;
    @Autowired
    private FetchStatisticRepository fetchStatisticRepository;

    private SubscriptionEntryBatchService subscriptionEntryBatchServiceMock = mock(SubscriptionEntryBatchService.class);
    private FeedParser feedParserMock = mock(FeedParser.class);
    private SubscriptionEntryBatchService subscriptionBatchServiceMock = mock(SubscriptionEntryBatchService.class);
    private SubscriptionEntrySearchService searchServiceMock = mock(SubscriptionEntrySearchService.class);

    @Before
    public void before() {
        reset(subscriptionEntryBatchServiceMock);
        reset(feedParserMock);
        reset(subscriptionBatchServiceMock);
        reset(searchServiceMock);

        uut = new SubscriptionBatchServiceImpl(feedParserMock, feedRepository, fetchStatisticRepository, subscriptionBatchServiceMock, searchServiceMock);
    }

    @Test
    public void testUpdateUserSubscriptions() {
        String url = "http://feeds.feedburner.com/javaposse";

        Feed before = feedRepository.findByUrl(url);
        assertThat(before.getLastModified(), is("Thu, 27 Mar 2014 13:23:32 GMT"));
        assertThat(before.getFetched(), is(282));

        FetchResult fetchResult = new FetchResult(Collections.<FetcherEntry>emptyList(), "last modified", "title");
        when(feedParserMock.parse(anyString())).thenReturn(fetchResult);
        when(subscriptionBatchServiceMock.updateUserSubscriptionEntries(Matchers.<Feed>anyObject(), Matchers.<List<FetcherEntry>>anyObject())).thenReturn(Arrays.asList(new SubscriptionEntry()));

        uut.updateUserSubscriptions(url);

        Feed after = feedRepository.findByUrl(url);

        assertThat(after.getLastModified(), is("last modified"));
        assertThat(after.getFetched(), is(283));
    }
}
