package myreader.service.subscriptionentry.impl;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.fetcher.SubscriptionEntryBatch;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedEntryRepository;
import myreader.repository.FeedRepository;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;

import java.util.Arrays;
import java.util.List;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryBatchServiceImplTest extends IntegrationTestSupport {

    @Autowired
    private SubscriptionEntryBatch uut;
    @Autowired
    private SubscriptionRepository subscriptionRepository;
	@Autowired
	private SubscriptionEntryRepository subscriptionEntryRepository;
    @Autowired
    private FeedRepository feedRepository;
    @Autowired
    private FeedEntryRepository feedEntryRepository;

    @Test
    public void testUpdateUserSubscriptionEntries() {
        Feed beforeFeed = feedRepository.findOne(100L);
        Subscription beforeSubscription = subscriptionRepository.findOne(100L);

        Page<FeedEntry> beforeFeedEntries = feedEntryRepository.findByFeedId(beforeFeed.getId(), new PageRequest(1,10));
        Slice<SubscriptionEntry> beforeSubscriptionEntries = subscriptionEntryRepository.findBySubscriptionAndUser(beforeSubscription.getUser().getId(),
                beforeSubscription.getId(), Long.MAX_VALUE, new PageRequest(0, 10));

        assertThat(beforeFeed.getUrl(), is(beforeSubscription.getFeed().getUrl()));
        assertThat(beforeFeedEntries.getTotalElements(), is(0L));
        assertThat(beforeSubscriptionEntries.getContent(), hasSize(0));
        assertThat(beforeFeed.getUrl(), is(beforeSubscription.getFeed().getUrl()));
        assertThat(beforeSubscription.getUnseen(), is(0));
        assertThat(beforeSubscription.getSum(), is(0));

        List<SubscriptionEntry> subscriptionEntries = uut.updateUserSubscriptionEntries(beforeFeed, Arrays.asList(fetcherEntry()));
        assertThat(subscriptionEntries.size(), is(1));

        Page<FeedEntry> afterFeedEntries = feedEntryRepository.findByFeedId(100L, new PageRequest(0,10));
        assertThat(afterFeedEntries.getTotalElements(), is(1L));

        Slice<SubscriptionEntry> afterSubscriptionEntries = subscriptionEntryRepository.findBySubscriptionAndUser(beforeSubscription.getUser().getId(),
                beforeSubscription.getId(), Long.MAX_VALUE, new PageRequest(0, 10));

        Subscription afterSubscriptionClearedEm = subscriptionRepository.findOne(100L);
        assertThat(afterSubscriptionEntries.getContent(), hasSize(1));
        assertThat(afterSubscriptionClearedEm.getUnseen(), is(1));
        assertThat(afterSubscriptionClearedEm.getSum(), is(1));
    }

    private FetcherEntry fetcherEntry() {
        FetcherEntry fetcherEntry = new FetcherEntry();
        fetcherEntry.setTitle("title");
        fetcherEntry.setUrl("url");
        fetcherEntry.setContent("content");
        fetcherEntry.setGuid("guid");
        return fetcherEntry;
    }
}
