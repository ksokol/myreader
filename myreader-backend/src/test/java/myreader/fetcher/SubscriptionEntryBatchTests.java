package myreader.fetcher;

import myreader.entity.ExclusionPattern;
import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.repository.ExclusionRepository;
import myreader.repository.FeedEntryRepository;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.test.annotation.DirtiesContext;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class SubscriptionEntryBatchTests extends IntegrationTestSupport {

    @Autowired
    private SubscriptionEntryBatch uut;
    @Autowired
    private SubscriptionRepository subscriptionRepository;
	@Autowired
	private SubscriptionEntryRepository subscriptionEntryRepository;
    @Autowired
    private FeedEntryRepository feedEntryRepository;
    @Autowired
    private ExclusionRepository exclusionRepository;

    @Test
    public void shouldUpdateSubscriptionStatus() {
        Subscription beforeSubscription = subscriptionRepository.findOne(101L);
        assertThat(beforeSubscription.getUnseen(), is(1));
        assertThat(beforeSubscription.getFetchCount(), is(15));

        FeedEntry feedEntry = createFeedEntry(beforeSubscription.getFeed());
        uut.updateUserSubscriptionEntries();

        Subscription afterSubscriptionClearedEm = subscriptionRepository.findOne(beforeSubscription.getId());
        assertThat(afterSubscriptionClearedEm.getUnseen(), is(2));
        assertThat(afterSubscriptionClearedEm.getFetchCount(), is(16));
        assertThat(afterSubscriptionClearedEm.getLastFeedEntryId(), is(feedEntry.getId()));
    }

    @Test
    public void shouldUpdateSubscriptionEntries() {
        Subscription beforeSubscription = subscriptionRepository.findOne(101L);
        createFeedEntry(beforeSubscription.getFeed());

        Slice<SubscriptionEntry> beforeSubscriptionEntries = subscriptionEntryRepository.findBySubscriptionAndUser(beforeSubscription.getUser().getId(),
                beforeSubscription.getId(), Long.MAX_VALUE, new PageRequest(0, 10));
        assertThat(beforeSubscriptionEntries.getContent(), hasSize(0));

        uut.updateUserSubscriptionEntries();

        Slice<SubscriptionEntry> afterSubscriptionEntries = subscriptionEntryRepository.findBySubscriptionAndUser(beforeSubscription.getUser().getId(),
                beforeSubscription.getId(), Long.MAX_VALUE, new PageRequest(0, 10));
        assertThat(afterSubscriptionEntries.getContent(), hasSize(1));
    }

    @Test
    public void shouldNotUpdateSubscriptionExclusions() {
        Subscription beforeSubscription = subscriptionRepository.findOne(101L);
        createFeedEntry(beforeSubscription.getFeed());

        ExclusionPattern exclusionPattern = new ExclusionPattern();
        exclusionPattern.setSubscription(beforeSubscription);
        exclusionPattern.setPattern("irrelevant");
        exclusionPattern = exclusionRepository.save(exclusionPattern);

        uut.updateUserSubscriptionEntries();

        final ExclusionPattern afterExclusionsClearedEm = exclusionRepository.findOne(exclusionPattern.getId());
        assertThat(afterExclusionsClearedEm.getHitCount(), is(0));
    }

    @Test
    public void shouldNotUpdateSubscriptionStatus() {
        Subscription beforeSubscription = subscriptionRepository.findOne(6L);
        assertThat(beforeSubscription.getUnseen(), is(0));
        assertThat(beforeSubscription.getFetchCount(), is(15));
        assertThat(beforeSubscription.getLastFeedEntryId(), nullValue());

        FeedEntry feedEntry = createFeedEntry(beforeSubscription.getFeed());

        uut.updateUserSubscriptionEntries();

        Subscription afterSubscriptionClearedEm = subscriptionRepository.findOne(beforeSubscription.getId());
        assertThat(afterSubscriptionClearedEm.getUnseen(), is(0));
        assertThat(afterSubscriptionClearedEm.getFetchCount(), is(15));
        assertThat(afterSubscriptionClearedEm.getLastFeedEntryId(), is(feedEntry.getId()));
    }

    @Test
    public void shouldNotUpdateSubscriptionEntries() {
        Subscription beforeSubscription = subscriptionRepository.findOne(6L);
        createFeedEntry(beforeSubscription.getFeed());

        Slice<SubscriptionEntry> beforeSubscriptionEntries = subscriptionEntryRepository.findBySubscriptionAndUser(beforeSubscription.getUser().getId(),
                beforeSubscription.getId(), Long.MAX_VALUE, new PageRequest(0, 10));
        assertThat(beforeSubscriptionEntries.getContent(), hasSize(0));

        uut.updateUserSubscriptionEntries();

        Slice<SubscriptionEntry> afterSubscriptionEntries = subscriptionEntryRepository.findBySubscriptionAndUser(beforeSubscription.getUser().getId(),
                beforeSubscription.getId(), Long.MAX_VALUE, new PageRequest(0, 10));
        assertThat(afterSubscriptionEntries.getContent(), hasSize(0));
    }

    @Test
    public void shouldUpdateSubscriptionExclusions() {
        Subscription beforeSubscription = subscriptionRepository.findOne(6L);
        createFeedEntry(beforeSubscription.getFeed());

        final Page<ExclusionPattern> exclusions = exclusionRepository.findBySubscriptionId(beforeSubscription.getId(), new PageRequest(0, 10));
        assertThat(exclusions.iterator().next().getHitCount(), is(1));

        uut.updateUserSubscriptionEntries();

        final Page<ExclusionPattern> afterExclusionsClearedEm = exclusionRepository.findBySubscriptionId(beforeSubscription.getId(), new PageRequest(0, 10));
        assertThat(afterExclusionsClearedEm.iterator().next().getHitCount(), is(2));
    }

    @Test
    public void noFeedEntriesGiven() {
        //TODO should not require this
        uut.updateUserSubscriptionEntries();

        int expectedSize = subscriptionEntryRepository.findAll().size();
        uut.updateUserSubscriptionEntries();
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
