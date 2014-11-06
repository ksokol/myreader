package myreader.service.subscriptionentry.impl;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedEntryRepository;
import myreader.repository.FeedRepository;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.service.subscriptionentry.SubscriptionEntryBatchService;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryBatchServiceImplTest extends IntegrationTestSupport {

    @Autowired
    private SubscriptionEntryBatchService uut;
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
        Feed beforeFeed = feedRepository.findOne(2L);
        Subscription beforeSubscription = subscriptionRepository.findOne(3L);

        Page<FeedEntry> beforeFeedEntries = feedEntryRepository.findByFeedId(beforeFeed.getId(), new PageRequest(1,10));
        Slice<SubscriptionEntry> beforeSubscriptionEntries = subscriptionEntryRepository.findBySubscriptionAndUser(beforeSubscription.getUser().getId(),
                beforeSubscription.getId(), Long.MAX_VALUE, new PageRequest(0, 10));

        assertThat(beforeFeed.getUrl(), is(beforeSubscription.getFeed().getUrl()));
        assertThat(beforeFeedEntries.getTotalElements(), is(3L));
        assertThat(beforeSubscriptionEntries.getContent(), hasSize(2));
        assertThat(beforeFeed.getUrl(), is(beforeSubscription.getFeed().getUrl()));
        assertThat(beforeSubscription.getUnseen(), is(0));
        assertThat(beforeSubscription.getSum(), is(25));

        List<SubscriptionEntry> subscriptionEntries = uut.updateUserSubscriptionEntries(beforeFeed, Arrays.asList(fetcherEntry(2L)));
        assertThat(subscriptionEntries.size(), is(2));

        Page<FeedEntry> afterFeedEntries = feedEntryRepository.findByFeedId(2L, new PageRequest(0,10));
        assertThat(afterFeedEntries.getTotalElements(), is(4L));

        Slice<SubscriptionEntry> afterSubscriptionEntries = subscriptionEntryRepository.findBySubscriptionAndUser(beforeSubscription.getUser().getId(),
                beforeSubscription.getId(), Long.MAX_VALUE, new PageRequest(0, 10));

        Subscription afterSubscriptionClearedEm = subscriptionRepository.findOne(3L);
        assertThat(afterSubscriptionEntries.getContent(), hasSize(3));
        assertThat(afterSubscriptionClearedEm.getUnseen(), is(1));
        assertThat(afterSubscriptionClearedEm.getSum(), is(26));
    }

    private FetcherEntry fetcherEntry(Long id) {
        FetcherEntry fetcherEntry = new FetcherEntry();
        fetcherEntry.setTitle("title");
        fetcherEntry.setUrl("url");
        fetcherEntry.setContent("content");
        fetcherEntry.setFeedId(id);
        fetcherEntry.setGuid("guid");
        return fetcherEntry;
    }
}
