package myreader.fetcher;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

import myreader.entity.ExclusionPattern;
import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.fetcher.persistence.FetcherEntry;
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
        FetcherEntry fetcherEntry = new FetcherEntry();
        fetcherEntry.setTitle("title");
        fetcherEntry.setUrl("url");
        fetcherEntry.setContent("content");
        fetcherEntry.setGuid("guid");
        fetcherEntry.setFeedUrl("http://localhost");

        Feed beforeFeed = feedRepository.findOne(100L);
        Subscription beforeSubscription = subscriptionRepository.findOne(100L);

        Page<FeedEntry> beforeFeedEntries = feedEntryRepository.findByFeedId(beforeFeed.getId(), new PageRequest(1,10));
        Slice<SubscriptionEntry> beforeSubscriptionEntries = subscriptionEntryRepository.findBySubscriptionAndUser(beforeSubscription.getUser().getId(),
                beforeSubscription.getId(), Long.MAX_VALUE, new PageRequest(0, 10));

        assertThat(beforeFeed.getUrl(), is(beforeSubscription.getFeed().getUrl()));
        assertThat(beforeFeedEntries.getTotalElements(), is(0L));
        assertThat(beforeSubscriptionEntries.getContent(), hasSize(0));
        assertThat(beforeSubscription.getUnseen(), is(0));
        assertThat(beforeSubscription.getFetchCount(), is(0));

        List<SubscriptionEntry> subscriptionEntries = uut.updateUserSubscriptionEntries(beforeFeed, Arrays.asList(fetcherEntry));
        assertThat(subscriptionEntries.size(), is(1));

        Page<FeedEntry> afterFeedEntries = feedEntryRepository.findByFeedId(100L, new PageRequest(0,10));
        assertThat(afterFeedEntries.getTotalElements(), is(1L));

        Slice<SubscriptionEntry> afterSubscriptionEntries = subscriptionEntryRepository.findBySubscriptionAndUser(beforeSubscription.getUser().getId(),
                beforeSubscription.getId(), Long.MAX_VALUE, new PageRequest(0, 10));

        Subscription afterSubscriptionClearedEm = subscriptionRepository.findOne(100L);
        assertThat(afterSubscriptionEntries.getContent(), hasSize(1));
        assertThat(afterSubscriptionClearedEm.getUnseen(), is(1));
        assertThat(afterSubscriptionClearedEm.getFetchCount(), is(1));
    }

    @Test
    public void noFetcherEntriesGiven() {
        List<SubscriptionEntry> subscriptionEntries = uut.updateUserSubscriptionEntries(new Feed(), Collections.<FetcherEntry>emptyList());
        assertThat(subscriptionEntries, hasSize(0));
    }

    @Test
    public void noFeedEntriesGiven() {
        FetcherEntry fetcherEntry = new FetcherEntry();
        fetcherEntry.setTitle("Party time");
        fetcherEntry.setUrl("http://Use-The-Index-Luke.com/blog/2013-03/Party-Time");
        fetcherEntry.setGuid("http://Use-The-Index-Luke.com");
        fetcherEntry.setFeedUrl("http://localhost");

        List<SubscriptionEntry> subscriptionEntries = uut.updateUserSubscriptionEntries(new Feed(), Arrays.asList(fetcherEntry));
        assertThat(subscriptionEntries, hasSize(0));
    }

    @Test
    public void updateUserSubscriptionEntries2() {
        FetcherEntry fetcherEntry1 = new FetcherEntry();
        fetcherEntry1.setTitle("user2_subscription1_pattern1");
        fetcherEntry1.setUrl("url1");
        fetcherEntry1.setContent("content1");
        fetcherEntry1.setGuid("guid1");
        fetcherEntry1.setFeedUrl("http://localhost");

        FetcherEntry fetcherEntry2 = new FetcherEntry();
        fetcherEntry2.setTitle("title1");
        fetcherEntry2.setUrl("url1");
        fetcherEntry2.setContent("content1");
        fetcherEntry2.setGuid("guid1");
        fetcherEntry2.setFeedUrl("http://localhost");


        Subscription beforeSubscription = subscriptionRepository.findOne(6L);
        final Page<ExclusionPattern> exclusions = exclusionRepository.findBySubscriptionId(beforeSubscription.getId(), new PageRequest(0, 10));

        assertThat(exclusions.getContent(), hasSize(1));
        assertThat(exclusions.iterator().next().getHitCount(), is(1));

        assertThat(beforeSubscription.getUnseen(), is(0));
        assertThat(beforeSubscription.getFetchCount(), is(15));

        List<SubscriptionEntry> subscriptionEntries = uut.updateUserSubscriptionEntries(beforeSubscription.getFeed(), Arrays.asList(fetcherEntry1, fetcherEntry2));
        assertThat(subscriptionEntries.size(), is(1));

        Slice<SubscriptionEntry> afterSubscriptionEntries = subscriptionEntryRepository.findBySubscriptionAndUser(beforeSubscription.getUser().getId(),
                beforeSubscription.getId(), Long.MAX_VALUE, new PageRequest(0, 10));

        Subscription afterSubscriptionClearedEm = subscriptionRepository.findOne(beforeSubscription.getId());
        assertThat(afterSubscriptionEntries.getContent(), hasSize(1));
        assertThat(afterSubscriptionClearedEm.getUnseen(), is(1));
        assertThat(afterSubscriptionClearedEm.getFetchCount(), is(16));

        final Page<ExclusionPattern> afterExclusionsClearedEm = exclusionRepository.findBySubscriptionId(afterSubscriptionClearedEm.getId(), new PageRequest(0, 10));

        assertThat(afterExclusionsClearedEm.getContent(), hasSize(1));
        assertThat(afterExclusionsClearedEm.iterator().next().getHitCount(), is(2));
    }
}
