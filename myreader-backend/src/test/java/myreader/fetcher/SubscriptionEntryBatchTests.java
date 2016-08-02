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
        Subscription beforeSubscription = subscriptionRepository.findOne(101L);
        assertThat(beforeSubscription.getUnseen(), is(1));
        assertThat(beforeSubscription.getSum(), is(15));

        Slice<SubscriptionEntry> beforeSubscriptionEntries = subscriptionEntryRepository.findBySubscriptionAndUser(beforeSubscription.getUser().getId(),
                beforeSubscription.getId(), Long.MAX_VALUE, new PageRequest(0, 10));
        assertThat(beforeSubscriptionEntries.getContent(), hasSize(0));

        FeedEntry feedEntry = createFeedEntry(beforeSubscription.getFeed());
        uut.updateUserSubscriptionEntries(feedEntry);

        Slice<SubscriptionEntry> afterSubscriptionEntries = subscriptionEntryRepository.findBySubscriptionAndUser(beforeSubscription.getUser().getId(),
                beforeSubscription.getId(), Long.MAX_VALUE, new PageRequest(0, 10));
        assertThat(afterSubscriptionEntries.getContent(), hasSize(1));

        Subscription afterSubscriptionClearedEm = subscriptionRepository.findOne(beforeSubscription.getId());
        assertThat(afterSubscriptionClearedEm.getUnseen(), is(2));
        assertThat(afterSubscriptionClearedEm.getSum(), is(16));
    }

    @Test
    public void shouldRejectExcludedFeedEntry() {
        Feed beforeFeed = feedRepository.findOne(5L);

        FeedEntry feedEntry1 = createFeedEntry(beforeFeed);

        Subscription beforeSubscription = subscriptionRepository.findOne(6L);

        int expectedSize = subscriptionEntryRepository.findAll().size();

        uut.updateUserSubscriptionEntries(feedEntry1);

        assertThat(subscriptionEntryRepository.findAll(), hasSize(expectedSize));

        subscriptionEntryRepository.findBySubscriptionAndUser(beforeSubscription.getUser().getId(),
                beforeSubscription.getId(), Long.MAX_VALUE, new PageRequest(0, 10));

        final Page<ExclusionPattern> afterExclusionsClearedEm = exclusionRepository.findBySubscriptionId(beforeSubscription.getId(), new PageRequest(0, 10));

        assertThat(afterExclusionsClearedEm.iterator().next().getHitCount(), is(2));
    }

    @Test
    public void noFeedEntriesGiven() {
        FeedEntry feedEntry = new FeedEntry();
        feedEntry.setFeed(new Feed());

        int expectedSize = subscriptionEntryRepository.findAll().size();

        uut.updateUserSubscriptionEntries(feedEntry);

        assertThat(subscriptionEntryRepository.findAll(), hasSize(expectedSize));
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
