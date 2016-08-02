package myreader.fetcher;

import myreader.entity.ExclusionPattern;
import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.repository.ExclusionRepository;
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
import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryBatchTests extends IntegrationTestSupport {

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
    @Autowired
    private ExclusionRepository exclusionRepository;

    @Test
    public void updateUserSubscriptionEntries() {
        Feed beforeFeed = feedRepository.findOne(100L);
        Subscription beforeSubscription = subscriptionRepository.findOne(100L);

        Page<FeedEntry> beforeFeedEntries = feedEntryRepository.findByFeedId(beforeFeed.getId(), new PageRequest(1,10));
        Slice<SubscriptionEntry> beforeSubscriptionEntries = subscriptionEntryRepository.findBySubscriptionAndUser(beforeSubscription.getUser().getId(),
                beforeSubscription.getId(), Long.MAX_VALUE, new PageRequest(0, 10));

        assertThat(beforeFeed.getUrl(), is(beforeSubscription.getFeed().getUrl()));
        assertThat(beforeFeedEntries.getTotalElements(), is(0L));
        assertThat(beforeSubscriptionEntries.getContent(), hasSize(0));
        assertThat(beforeSubscription.getUnseen(), is(0));
        assertThat(beforeSubscription.getSum(), is(0));

        FeedEntry feedEntry = createFeedEntry(beforeFeed);

        List<SubscriptionEntry> subscriptionEntries = uut.updateUserSubscriptionEntries(beforeFeed, Arrays.asList(feedEntry));
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

    @Test
    public void updateUserSubscriptionEntries2() {
        Feed beforeFeed = feedRepository.findOne(100L);

        FeedEntry feedEntry1 = createFeedEntry(beforeFeed);

        Subscription beforeSubscription = subscriptionRepository.findOne(6L);

        uut.updateUserSubscriptionEntries(beforeSubscription.getFeed(), Collections.singletonList(feedEntry1));

        subscriptionEntryRepository.findBySubscriptionAndUser(beforeSubscription.getUser().getId(),
                beforeSubscription.getId(), Long.MAX_VALUE, new PageRequest(0, 10));

        final Page<ExclusionPattern> afterExclusionsClearedEm = exclusionRepository.findBySubscriptionId(beforeSubscription.getId(), new PageRequest(0, 10));

        assertThat(afterExclusionsClearedEm.iterator().next().getHitCount(), is(2));
    }

    @Test
    public void noFetcherEntriesGiven() {
        List<SubscriptionEntry> subscriptionEntries = uut.updateUserSubscriptionEntries(new Feed(), Collections.emptyList());
        assertThat(subscriptionEntries, hasSize(0));
    }

    @Test
    public void noFeedEntriesGiven() {
        Feed beforeFeed = feedRepository.findOne(0L);

        FeedEntry feedEntry = createFeedEntry(beforeFeed);

        List<SubscriptionEntry> subscriptionEntries = uut.updateUserSubscriptionEntries(new Feed(), Arrays.asList(feedEntry));
        assertThat(subscriptionEntries, hasSize(0));
    }

    private FeedEntry createFeedEntry(Feed beforeFeed) {
        FeedEntry feedEntry = new FeedEntry();
        feedEntry.setTitle("user2_subscription1_pattern1");
        feedEntry.setUrl("url");
        feedEntry.setContent("content");
        feedEntry.setGuid("guid");
        feedEntry.setFeed(beforeFeed);
        feedEntryRepository.save(feedEntry);
        return feedEntry;
    }
}
